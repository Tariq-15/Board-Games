import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Game } from "@/lib/data/games"

interface GameInfoProps {
  game: Game
}

export function GameInfo({ game }: GameInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-muted-foreground">{game.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-1">Players</h4>
            <p className="text-muted-foreground">
              {game.minPlayers}-{game.maxPlayers}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Play Time</h4>
            <p className="text-muted-foreground">{game.playtime} minutes</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Category</h4>
            <p className="text-muted-foreground">{game.category_name}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Rating</h4>
            <p className="text-muted-foreground">
              {game.rating}/5 ({game.reviewCount} reviews)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
