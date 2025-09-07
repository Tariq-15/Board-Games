import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { GameImage } from "@/components/ui/game-image"
import { WishlistButton } from "@/components/ui/wishlist-button"
import Link from "next/link"
import { GameService } from "@/lib/services/GameService"
import { GamePagination } from "./game-pagination"
import type { GameFilters } from "@/Controller/GameController"

export async function GameGrid({ searchParams }: { searchParams: GameFilters }) {
  const gameService = new GameService()
  const { games, totalPages, currentPage } = await gameService.getGames(searchParams)

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No games found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow h-full">
            <Link href={`/games/${game.id}`}>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <GameImage src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              </div>
            </Link>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Link href={`/games/${game.id}`}>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">{game.title}</CardTitle>
                </Link>
                <Badge variant="secondary">{game.category_name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <span>{game.min_players}-{game.max_players} players</span>
                <span>•</span>
                <span>{game.playing_time} min</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="text-sm font-medium">{game.average_rating || 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <WishlistButton 
                  gameId={game.id} 
                  gameTitle={game.title}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                />
                <Link href={`/games/${game.id}`} className="flex-1">
                  <button className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    View Details
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GamePagination currentPage={currentPage} totalPages={totalPages} searchParams={searchParams as Record<string, string | undefined>} />
    </div>
  )
}
