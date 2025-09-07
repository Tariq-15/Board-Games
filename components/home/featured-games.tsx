import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock } from "lucide-react"
import Link from "next/link"
import { GameService } from "@/lib/services/GameService"
import { GameImage } from "@/components/ui/game-image"
import { WishlistButton } from "@/components/ui/wishlist-button"

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
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
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

              <div className="flex items-center justify-between text-sm mb-4">
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
    </section>
  )
}
