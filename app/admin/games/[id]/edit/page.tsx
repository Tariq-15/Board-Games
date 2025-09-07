"use client"

import { GameForm } from "@/components/admin/game-form"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { use } from "react"
import { GameService } from "@/lib/services/GameService"
import type { Game } from "@/Model/Game"

export default function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  // Load game data on component mount
  useEffect(() => {
    const loadGame = async () => {
      console.log("Loading game with ID:", id)
      setLoading(true) // Ensure loading state is set
      
      try {
        const gameService = new GameService()
        console.log("GameService created, calling getGameByIdForAdmin...")
        
        const gameData = await gameService.getGameByIdForAdmin(id)
        console.log("Game data received:", gameData)
        
        if (!gameData) {
          console.log("No game data found for ID:", id)
          toast.error("Game not found")
          router.push("/admin/games")
          return
        }
        
        console.log("Setting game data and stopping loading...")
        setGame(gameData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading game:", error)
        toast.error("Failed to load game")
        setLoading(false)
      }
    }
    
    if (id) {
      loadGame()
    } else {
      console.log("No ID provided, stopping loading")
      setLoading(false)
    }
  }, [id]) // Removed router from dependencies to prevent infinite loop

  const handleSubmit = async (gameData: Partial<Game>) => {
    if (!game) return
    
    setUpdating(true)
    try {
      console.log("Updating game with data:", gameData)
      
      const gameService = new GameService()
      await gameService.updateGame(game.id, gameData)
      
      toast.success("Game updated successfully!")
      router.push("/admin/games")
    } catch (error) {
      console.error("Error updating game:", error)
      toast.error("Failed to update game")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading game...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Game not found</h1>
            <p className="mt-2 text-muted-foreground">The game you're looking for doesn't exist.</p>
            <button 
              onClick={() => router.push("/admin/games")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Game</h1>
          <p className="text-muted-foreground">Update game information and details</p>
        </div>

        <GameForm game={game} onSubmit={handleSubmit} isUpdating={updating} />
      </div>
    </div>
  )
}
