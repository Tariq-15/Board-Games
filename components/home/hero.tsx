import { Button } from "@/components/ui/button"
import { SearchWithSuggestions } from "@/components/ui/search-with-suggestions"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover Your Next
          <span className="text-primary block">Board Game Adventure</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore thousands of board games, read reviews from fellow enthusiasts, and find the perfect game for your
          next game night.
        </p>

        <div className="max-w-md mx-auto mb-8">
          <SearchWithSuggestions placeholder="Search for games..." />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/games">Browse All Games</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/categories">Explore Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
