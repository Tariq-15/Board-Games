"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { GameImage } from "@/components/ui/game-image"
import Link from "next/link"
import { GameService } from "@/lib/services/GameService"
import { useState } from "react"
import { toast } from "sonner"
import type { Game } from "@/Model/Game"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AdminGamesList({ games }: { games: Game[] }) {
  const [gamesList, setGamesList] = useState<Game[]>(games)
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteGame = async (game: Game) => {
    setIsDeleting(true)
    try {
      const gameService = new GameService()
      const success = await gameService.deleteGame(game.id)
      
      if (success) {
        setGamesList(prev => prev.filter(g => g.id !== game.id))
        toast.success(`Game "${game.title}" deleted successfully`)
      } else {
        toast.error(`Failed to delete game "${game.title}"`)
      }
    } catch (error) {
      console.error('Error deleting game:', error)
      toast.error(`Error deleting game: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
      setGameToDelete(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {gamesList.map((game) => (
          <Card key={game.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-16 overflow-hidden rounded">
                  <GameImage
                    src={game.image_url || "/placeholder.svg?height=100&width=150"}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold truncate">{game.title}</h3>
                    <Badge variant={game.is_active ? "default" : "secondary"}>
                      {game.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {game.category_name || 'No Category'} • {game.average_rating ? `${game.average_rating}/5` : 'No Rating'} ({game.review_count || 0} reviews)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {game.publisher} • {game.year_published} • {game.min_players}-{game.max_players} players • {game.playing_time} min
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Designer: {game.designer} • Complexity: {game.complexity_rating}/5 • Price: ${game.price}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/games/${game.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/games/${game.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Add to Featured</DropdownMenuItem>
                      <DropdownMenuItem>Publish Game</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate Game</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setGameToDelete(game)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Game
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!gameToDelete} onOpenChange={() => setGameToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the game "{gameToDelete?.title}" and remove it from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => gameToDelete && handleDeleteGame(gameToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Game'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
