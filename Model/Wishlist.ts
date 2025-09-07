import { supabase } from "@/lib/supabase/client"

export interface WishlistItem {
  id: string
  user_id: string
  game_id: string
  created_at: string
  game?: {
    id: string
    title: string
    image_url?: string
    category?: {
      name: string
    }
  }
}

export class WishlistModel {
  private table = 'wishlist'

  async addToWishlist(userId: string, gameId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from(this.table)
        .insert({
          user_id: userId,
          game_id: gameId
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'Game is already in your wishlist' }
        }
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to add to wishlist' }
    }
  }

  async removeFromWishlist(userId: string, gameId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('user_id', userId)
        .eq('game_id', gameId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to remove from wishlist' }
    }
  }

  async getUserWishlist(userId: string): Promise<{ success: boolean; data?: WishlistItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(`
          id,
          user_id,
          game_id,
          created_at,
          game:games(
            id,
            title,
            image_url,
            category:categories(
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: 'Failed to fetch wishlist' }
    }
  }

  async isInWishlist(userId: string, gameId: string): Promise<{ success: boolean; isInWishlist?: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('id')
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        return { success: false, error: error.message }
      }

      return { success: true, isInWishlist: !!data }
    } catch (error) {
      return { success: false, error: 'Failed to check wishlist status' }
    }
  }
}
