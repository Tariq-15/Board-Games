import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock } from "lucide-react"
import Link from "next/link"
import { GameService } from "@/lib/services/GameService"
import { GameImage } from "@/components/ui/game-image"

export async function FeaturedGames() {
  const gameService = new GameService()
  const games = await gameService.getFeaturedGames()

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Games</h2>
        <p className="text-muted-foreground">Discover the most popular and highly-rated board games</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
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
