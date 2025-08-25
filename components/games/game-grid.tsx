import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { GameImage } from "@/components/ui/game-image"
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
          <Link key={game.id} href={`/games/${game.id}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <GameImage src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{game.title}</CardTitle>
                  <Badge variant="secondary">{game.category_name}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{game.min_players}-{game.max_players} players</span>
                  <span>•</span>
                  <span>{game.playing_time} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-medium">{game.average_rating || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <GamePagination currentPage={currentPage} totalPages={totalPages} searchParams={searchParams as Record<string, string | undefined>} />
    </div>
  )
}
