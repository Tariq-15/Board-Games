import { supabase } from '@/lib/supabase/client'

export interface Category {
  id: string
  name: string
  description: string
  created_at: string
  // Computed fields
  game_count?: number
}

export class CategoryModel {
  private static instance: CategoryModel

  private constructor() {}

  public static getInstance(): CategoryModel {
    if (!CategoryModel.instance) {
      CategoryModel.instance = new CategoryModel()
    }
    return CategoryModel.instance
  }

  public async findAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  }

  public async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return null
    }

    return data
  }

  public async findFeatured(): Promise<Category[]> {
    // Get categories with game counts
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        games!inner(is_active)
      `)
      .eq('games.is_active', true)

    if (error) {
      console.error('Error fetching featured categories:', error)
      return []
    }

    // Process the data to get unique categories with counts
    const categoryMap = new Map<string, Category>()
    
    data?.forEach(item => {
      if (!categoryMap.has(item.id)) {
        categoryMap.set(item.id, {
          ...item,
          game_count: 1
        })
      } else {
        const existing = categoryMap.get(item.id)!
        existing.game_count = (existing.game_count || 0) + 1
      }
    })

    return Array.from(categoryMap.values())
      .filter(cat => (cat.game_count || 0) > 0)
      .sort((a, b) => (b.game_count || 0) - (a.game_count || 0))
      .slice(0, 6)
  }
}
