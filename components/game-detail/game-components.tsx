import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/Model/Game"

interface GameComponentsProps {
  game: Game
}

export function GameComponents({ game }: GameComponentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Publisher</h4>
              <p className="text-sm">{game.publisher}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Designer</h4>
              <p className="text-sm">{game.designer}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Year Published</h4>
              <p className="text-sm">{game.year_published}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
              <p className="text-sm">{game.category_name || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Players</h4>
              <p className="text-sm">{game.min_players}-{game.max_players}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Playing Time</h4>
              <p className="text-sm">{game.playing_time} min</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Min Age</h4>
              <p className="text-sm">{game.min_age}+</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Complexity</h4>
              <p className="text-sm">{game.complexity_rating}/5</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Quick Stats</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {game.min_players}-{game.max_players} Players
              </Badge>
              <Badge variant="secondary">
                {game.playing_time} min
              </Badge>
              <Badge variant="secondary">
                Age {game.min_age}+
              </Badge>
              {game.average_rating !== undefined && game.average_rating > 0 && (
                <Badge variant="outline">
                  ⭐ {game.average_rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
