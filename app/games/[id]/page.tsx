import { GameHeader } from "@/components/game-detail/game-header"
import { GameInfo } from "@/components/game-detail/game-info"
import { GameMedia } from "@/components/game-detail/game-media"
import { GameComponents } from "@/components/game-detail/game-components"
import { GameReviews } from "@/components/game-detail/game-reviews"
import { SimilarGames } from "@/components/game-detail/similar-games"
import { GameService } from "@/lib/services/GameService"
import { notFound } from "next/navigation"

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const gameService = new GameService()
  const game = await gameService.getGameById(id)

  if (!game) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GameHeader game={game} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <GameInfo game={game} />
          <GameMedia game={game} />
          <GameComponents game={game} />
        </div>

        <div className="lg:col-span-1">
          <GameReviews gameId={game.id} gameTitle={game.title} />
        </div>
      </div>

      <div className="mt-12">
        <SimilarGames currentGame={game} />
      </div>
    </div>
  )
}
