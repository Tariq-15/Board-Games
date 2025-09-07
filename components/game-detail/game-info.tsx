import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Game } from "@/Model/Game"

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
              {game.min_players}-{game.max_players}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Play Time</h4>
            <p className="text-muted-foreground">{game.playing_time} minutes</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Category</h4>
            <p className="text-muted-foreground">{game.category_name}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Rating</h4>
            <p className="text-muted-foreground">
              {game.average_rating ? `${game.average_rating}/5` : 'N/A'} ({game.review_count || 0} reviews)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
