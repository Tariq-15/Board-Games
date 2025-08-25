import { GameSearch } from "@/components/games/game-search"
import { GameFilters } from "@/components/games/game-filters"
import { GameGrid } from "@/components/games/game-grid"
import { Suspense } from "react"
import { GameGridSkeleton } from "@/components/games/game-grid-skeleton"

interface SearchParams {
  search?: string
  category?: string
  players?: string
  playtime?: string
  page?: string
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Games</h1>
        <GameSearch />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <GameFilters />
        </aside>

        <main className="lg:col-span-3">
          <Suspense fallback={<GameGridSkeleton />}>
            <GameGrid searchParams={params} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
