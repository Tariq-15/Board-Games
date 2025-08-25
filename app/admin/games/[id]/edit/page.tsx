"use client"

import { GameForm } from "@/components/admin/game-form"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { use } from "react"

export default function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  // Load game data on component mount
  useEffect(() => {
    const loadGame = async () => {
      console.log("Loading game with ID:", id)
      try {
        // For now, let's use a mock game to test the form
        const mockGame = {
          id: id,
          title: "Test Game",
          description: "This is a test game description",
          short_description: "Test game short description",
          publisher: "Test Publisher",
          designer: "Test Designer",
          year_published: 2024,
          min_players: 2,
          max_players: 4,
          min_age: 8,
          playing_time: 60,
          complexity_rating: 3,
          price: 29.99,
          image_url: "/placeholder.jpg",
          thumbnail_url: "/placeholder.jpg",
          category_id: "strategy",
          is_active: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          category_name: "Strategy",
          average_rating: 4.0,
          review_count: 5
        }
        
        console.log("Mock game data created:", mockGame)
        setGame(mockGame)
        setLoading(false)
      } catch (error) {
        console.error("Error loading game:", error)
        toast.error("Failed to load game")
        setLoading(false)
      }
    }
    loadGame()
  }, [id])

  const handleSubmit = async (gameData: any) => {
    try {
      console.log("Form submitted with data:", gameData)
      toast.success("Game updated successfully (mock)")
      router.push("/admin/games")
    } catch (error) {
      console.error("Error updating game:", error)
      toast.error("Failed to update game")
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

        <GameForm game={game} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
