import { ReviewsList } from "@/components/reviews/reviews-list"
import { ReviewsFilters } from "@/components/reviews/reviews-filters"

interface SearchParams {
  game?: string
  rating?: string
  page?: string
}

export default function ReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Game Reviews</h1>
        <p className="text-muted-foreground">Read what the community thinks about board games</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ReviewsFilters />
        </aside>

        <main className="lg:col-span-3">
          <ReviewsList searchParams={searchParams} />
        </main>
      </div>
    </div>
  )
}
