import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock } from "lucide-react"
import Link from "next/link"
import { GameService } from "@/lib/services/GameService"
import type { Game } from "@/Model/Game"
import { GameImage } from "@/components/ui/game-image"

interface SimilarGamesProps {
  currentGame: Game
}

export async function SimilarGames({ currentGame }: SimilarGamesProps) {
  const gameService = new GameService()
  const similarGames = await gameService.getSimilarGames(currentGame)

  if (similarGames.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Similar Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarGames.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
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

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {game.min_players}-{game.max_players}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {game.playing_time}min
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {game.average_rating || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
