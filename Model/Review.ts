import { supabase } from '@/lib/supabase/client'

export interface Review {
  id: string
  game_id: string
  user_id: string
  rating: number
  title: string
  content: string
  is_verified_purchase: boolean
  status: string
  created_at: string
  updated_at: string
  // Computed fields
  user_name?: string
  user_email?: string
  game_title?: string
}

export class ReviewModel {
  private static instance: ReviewModel

  private constructor() {}

  public static getInstance(): ReviewModel {
    if (!ReviewModel.instance) {
      ReviewModel.instance = new ReviewModel()
    }
    return ReviewModel.instance
  }

  public async findByGameId(gameId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles(full_name, email),
        games(title)
      `)
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews for game:', error)
      return []
    }

    return data?.map(review => ({
      ...review,
      user_name: review.profiles?.full_name,
      user_email: review.profiles?.email,
      game_title: review.games?.title
    })) || []
  }

  public async findAll(filters: { status?: string } = {}): Promise<Review[]> {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        profiles(full_name, email),
        games(title)
      `)
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    return data?.map(review => ({
      ...review,
      user_name: review.profiles?.full_name,
      user_email: review.profiles?.email,
      game_title: review.games?.title
    })) || []
  }

  public async findById(id: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles(full_name, email),
        games(title)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching review:', error)
      return null
    }

    return data ? {
      ...data,
      user_name: data.profiles?.full_name,
      user_email: data.profiles?.email,
      game_title: data.games?.title
    } : null
  }

  public async create(reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      throw new Error('Failed to create review')
    }

    return data
  }

  public async update(id: string, reviewData: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({ ...reviewData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating review:', error)
      throw new Error('Failed to update review')
    }

    return data
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting review:', error)
      return false
    }

    return true
  }
}
