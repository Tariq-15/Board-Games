import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameImage } from "@/components/ui/game-image"
import type { Game } from "@/Model/Game"

interface GameMediaProps {
  game: Game
}

export function GameMedia({ game }: GameMediaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Game Image */}
        <div>
          <h4 className="font-medium mb-3">Game Image</h4>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            <GameImage
              src={game.image_url || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Game Details */}
        <div>
          <h4 className="font-medium mb-3">Game Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Publisher:</span>
              <p className="text-muted-foreground">{game.publisher}</p>
            </div>
            <div>
              <span className="font-medium">Designer:</span>
              <p className="text-muted-foreground">{game.designer}</p>
            </div>
            <div>
              <span className="font-medium">Year Published:</span>
              <p className="text-muted-foreground">{game.year_published}</p>
            </div>
            <div>
              <span className="font-medium">Complexity:</span>
              <p className="text-muted-foreground">{game.complexity_rating}/5</p>
            </div>
            <div>
              <span className="font-medium">Players:</span>
              <p className="text-muted-foreground">{game.min_players}-{game.max_players}</p>
            </div>
            <div>
              <span className="font-medium">Playing Time:</span>
              <p className="text-muted-foreground">{game.playing_time} min</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
