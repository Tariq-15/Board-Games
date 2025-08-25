import { CategoriesGrid } from "@/components/categories/categories-grid"
import { CategoriesHero } from "@/components/categories/categories-hero"

export default function CategoriesPage() {
  return (
    <div className="space-y-12">
      <CategoriesHero />
      <div className="container mx-auto px-4">
        <CategoriesGrid />
      </div>
    </div>
  )
}
