import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Gamepad2, Users, Zap, Heart, Puzzle, Trophy } from "lucide-react"
import { CategoryService } from "@/lib/services/CategoryService"

export async function GameCategories() {
  const categoryService = new CategoryService()
  const categories = await categoryService.getCategories()
  const featuredCategories = categories.filter((cat) => cat.featured).slice(0, 6)

  const iconMap = {
    Puzzle,
    Heart,
    Users,
    Gamepad2,
    Zap,
    Trophy,
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
        <p className="text-muted-foreground">Find games that match your style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCategories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Puzzle
          return (
            <Link key={category.id} href={`/games?category=${category.name.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary">{category.count} games</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <Link href="/categories" className="text-primary hover:underline">
          View all categories →
        </Link>
      </div>
    </section>
  )
}
