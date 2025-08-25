import { AdminGamesList } from "@/components/admin/admin-games-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth/admin"
import { GameService } from "@/lib/services/GameService"

export default async function AdminGamesPage() {
  await requireAdmin()
  
  const gameService = new GameService()
  const games = await gameService.getAllGames()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Games</h1>
          <p className="text-muted-foreground">Add, edit, and remove board games</p>
        </div>
        <Button asChild>
          <Link href="/admin/games/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Game
          </Link>
        </Button>
      </div>

      <AdminGamesList games={games} />
    </div>
  )
}
