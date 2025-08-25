import { Hero } from "@/components/home/hero"
import { FeaturedGames } from "@/components/home/featured-games"
import { GameCategories } from "@/components/home/game-categories"
import { CallToAction } from "@/components/home/recent-reviews"

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <div className="container mx-auto px-4 space-y-12">
        <FeaturedGames />
        <GameCategories />
        <CallToAction />
      </div>
    </div>
  )
}
