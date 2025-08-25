import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to Our Board Game Store</h2>
        <p className="text-muted-foreground">Discover and play your favorite board games</p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Game?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of board game enthusiasts discovering new favorites every day. Browse our collection and find
            the perfect game for your next game night.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/games">Browse All Games</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
