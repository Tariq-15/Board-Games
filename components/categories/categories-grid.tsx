import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CategoryService } from "@/lib/services/CategoryService"

export async function CategoriesGrid() {
  const categoryService = new CategoryService()
  const categories = await categoryService.getCategories()

  return (
    <div className="space-y-12">
      {/* All Categories */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Game Categories</h2>
          <p className="text-muted-foreground">Browse our complete collection of game categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/games?category=${category.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge variant="outline">{category.game_count || 0}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Stats */}
      <section className="bg-muted/50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Category Statistics</h2>
          <p className="text-muted-foreground">Overview of our game collection</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {categories.reduce((sum, cat) => sum + (cat.game_count || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Games</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {categories.filter(cat => (cat.game_count || 0) > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + (cat.game_count || 0), 0) / categories.length) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg per Category</div>
          </div>
        </div>
      </section>
    </div>
  )
}
