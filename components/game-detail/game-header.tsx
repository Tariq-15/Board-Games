import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock } from "lucide-react"
import { GameImage } from "@/components/ui/game-image"
import { WishlistButton } from "@/components/ui/wishlist-button"
import type { Game } from "@/Model/Game"

interface GameHeaderProps {
  game: Game
}

export function GameHeader({ game }: GameHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <GameImage src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{game.category_name}</Badge>
            <Badge variant="outline">Featured</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
          <p className="text-lg text-muted-foreground">{game.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">
              {game.min_players}-{game.max_players} Players
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{game.playing_time} minutes</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{game.average_rating || 'N/A'}</span>
            <span className="text-muted-foreground">({game.review_count || 0} reviews)</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <WishlistButton 
            gameId={game.id} 
            gameTitle={game.title}
            size="lg"
            className="flex-1"
          />
          <Button size="lg" variant="outline" className="flex-1 bg-transparent">
            Share Game
          </Button>
        </div>
      </div>
    </div>
  )
}
