import { supabase } from '@/lib/supabase/client'
import type { GameFilters } from '@/Controller/GameController'

export interface Game {
  id: string
  title: string
  description: string
  short_description: string
  publisher: string
  designer: string
  year_published: number
  min_players: number
  max_players: number
  min_age: number
  playing_time: number
  complexity_rating: number
  price: number
  image_url: string
  thumbnail_url: string
  category_id: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Computed fields
  category_name?: string
  average_rating?: number
  review_count?: number
}

export class GameModel {
  private static instance: GameModel

  private constructor() {}

  public static getInstance(): GameModel {
    if (!GameModel.instance) {
      GameModel.instance = new GameModel()
    }
    return GameModel.instance
  }

  // CRUD Operations
  public async findAll(): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          categories(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching games:', error)
        return []
      }

      // Get average ratings and review counts for all games
      const gameIds = data?.map(game => game.id) || []
      let ratingsData: any[] = []
      
      if (gameIds.length > 0) {
        const { data: ratings, error: ratingsError } = await supabase
          .from('reviews')
          .select('game_id, rating')
          .in('game_id', gameIds)
          .eq('status', 'approved')
        
        if (!ratingsError && ratings) {
          ratingsData = ratings
        }
      }

      return data?.map(game => {
        const gameReviews = ratingsData.filter(r => r.game_id === game.id)
        const averageRating = gameReviews.length > 0 
          ? gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length 
          : 0
        
        return {
          ...game,
          category_name: game.categories?.name || 'Unknown',
          average_rating: Number(averageRating.toFixed(1)),
          review_count: gameReviews.length
        }
      }) || []
    } catch (error) {
      console.error('Unexpected error in findAll:', error)
      return []
    }
  }

  public async findById(id: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        categories(name)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching game:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Get average rating and review count for this game
    const { data: ratings, error: ratingsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('game_id', id)
      .eq('status', 'approved')

    let averageRating = 0
    let reviewCount = 0

    if (!ratingsError && ratings) {
      reviewCount = ratings.length
      if (reviewCount > 0) {
        averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      }
    }

    return {
      ...data,
      category_name: data.categories?.name,
      average_rating: Number(averageRating.toFixed(1)),
      review_count: reviewCount
    }
  }

  public async findByIdForAdmin(id: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        categories(name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching game for admin:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Get average rating and review count for this game
    const { data: ratings, error: ratingsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('game_id', id)
      .eq('status', 'approved')

    let averageRating = 0
    let reviewCount = 0

    if (!ratingsError && ratings) {
      reviewCount = ratings.length
      if (reviewCount > 0) {
        averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      }
    }

    return {
      ...data,
      category_name: data.categories?.name,
      average_rating: Number(averageRating.toFixed(1)),
      review_count: reviewCount
    }
  }

  public async findFeatured(): Promise<Game[]> {
    try {
      // First try with category join
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          categories(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching featured games with categories:', error)
        
        // Fallback: get games without category join
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('games')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (fallbackError) {
          console.error('Error fetching featured games fallback:', fallbackError)
          return []
        }

        // Get average ratings for fallback data
        const gameIds = fallbackData?.map(game => game.id) || []
        let ratingsData: any[] = []
        
        if (gameIds.length > 0) {
          const { data: ratings, error: ratingsError } = await supabase
            .from('reviews')
            .select('game_id, rating')
            .in('game_id', gameIds)
            .eq('status', 'approved')
          
          if (!ratingsError && ratings) {
            ratingsData = ratings
          }
        }

        return fallbackData?.map(game => {
          const gameReviews = ratingsData.filter(r => r.game_id === game.id)
          const averageRating = gameReviews.length > 0 
            ? gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length 
            : 0
          
          return {
            ...game,
            category_name: 'Unknown',
            average_rating: Number(averageRating.toFixed(1)),
            review_count: gameReviews.length
          }
        }) || []
      }

      // Get average ratings and review counts for featured games
      const gameIds = data?.map(game => game.id) || []
      let ratingsData: any[] = []
      
      if (gameIds.length > 0) {
        const { data: ratings, error: ratingsError } = await supabase
          .from('reviews')
          .select('game_id, rating')
          .in('game_id', gameIds)
          .eq('status', 'approved')
        
        if (!ratingsError && ratings) {
          ratingsData = ratings
        }
      }

      return data?.map(game => {
        const gameReviews = ratingsData.filter(r => r.game_id === game.id)
        const averageRating = gameReviews.length > 0 
          ? gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length 
          : 0
        
        return {
          ...game,
          category_name: game.categories?.name || 'Unknown',
          average_rating: Number(averageRating.toFixed(1)),
          review_count: gameReviews.length
        }
      }) || []
    } catch (error) {
      console.error('Unexpected error in findFeatured:', error)
      return []
    }
  }

  public async search(query: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        categories(name)
      `)
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('title', { ascending: true })

    if (error) {
      console.error('Error searching games:', error)
      return []
    }

    // Get average ratings and review counts for search results
    const gameIds = data?.map(game => game.id) || []
    let ratingsData: any[] = []
    
    if (gameIds.length > 0) {
      const { data: ratings, error: ratingsError } = await supabase
        .from('reviews')
        .select('game_id, rating')
        .in('game_id', gameIds)
        .eq('status', 'approved')
      
      if (!ratingsError && ratings) {
        ratingsData = ratings
      }
    }

    return data?.map(game => {
      const gameReviews = ratingsData.filter(r => r.game_id === game.id)
      const averageRating = gameReviews.length > 0 
        ? gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length 
        : 0
      
      return {
        ...game,
        category_name: game.categories?.name,
        average_rating: Number(averageRating.toFixed(1)),
        review_count: gameReviews.length
      }
    }) || []
  }

  public async findWithFilters(filters: GameFilters = {}): Promise<Game[]> {
    let query = supabase
      .from('games')
      .select(`
        *,
        categories(name)
      `)
      .eq('is_active', true)

    if (filters.search && filters.search.trim()) {
      query = query.or(`title.ilike.%${filters.search.trim()}%,description.ilike.%${filters.search.trim()}%`)
    }

    if (filters.category && filters.category !== "all-categories" && filters.category.trim()) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.players && filters.players !== "any-number" && filters.players.trim()) {
      const playerCount = filters.players === "5+" ? 5 : Number.parseInt(filters.players)
      if (!isNaN(playerCount)) {
        query = query.gte('min_players', playerCount).lte('max_players', playerCount)
      }
    }

    if (filters.playtime && filters.playtime.trim()) {
      const maxPlaytime = Number.parseInt(filters.playtime)
      if (!isNaN(maxPlaytime)) {
        query = query.lte('playing_time', maxPlaytime)
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching games with filters:', error)
      return []
    }

    // Get average ratings and review counts for all games
    const gameIds = data?.map(game => game.id) || []
    let ratingsData: any[] = []
    
    if (gameIds.length > 0) {
      const { data: ratings, error: ratingsError } = await supabase
        .from('reviews')
        .select('game_id, rating')
        .in('game_id', gameIds)
        .eq('status', 'approved')
      
      if (!ratingsError && ratings) {
        ratingsData = ratings
      }
    }

    return data?.map(game => {
      const gameReviews = ratingsData.filter(r => r.game_id === game.id)
      const averageRating = gameReviews.length > 0 
        ? gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length 
        : 0
      
      return {
        ...game,
        category_name: game.categories?.name,
        average_rating: Number(averageRating.toFixed(1)),
        review_count: gameReviews.length
      }
    }) || []
  }

  public async findSimilar(currentGame: Game): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        categories(name)
      `)
      .eq('is_active', true)
      .eq('category_id', currentGame.category_id)
      .neq('id', currentGame.id)
      .limit(3)

    if (error) {
      console.error('Error fetching similar games:', error)
      return []
    }

    // Get average ratings and review counts for similar games
    const gameIds = data?.map(game => game.id) || []
    let ratingsData: any[] = []
    
    if (gameIds.length > 0) {
      const { data: ratings, error: ratingsError } = await supabase
        .from('reviews')
        .select('game_id, rating')
        .in('game_id', gameIds)
        .eq('status', 'approved')
      
      if (!ratingsError && ratings) {
        ratingsData = ratings
      }
    }

    return data?.map(game => {
      const gameReviews = ratingsData.filter(r => r.game_id === game.id)
      const averageRating = gameReviews.length > 0 
        ? gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length 
        : 0
      
      return {
        ...game,
        category_name: game.categories?.name,
        average_rating: Number(averageRating.toFixed(1)),
        review_count: gameReviews.length
      }
    }) || []
  }

  public async create(gameData: Omit<Game, 'id' | 'created_at' | 'updated_at'>): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .insert([gameData])
      .select()
      .single()

    if (error) {
      console.error('Error creating game:', error)
      throw new Error('Failed to create game')
    }

    return data
  }

  public async update(id: string, gameData: Partial<Game>): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .update({ ...gameData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating game:', error)
      throw new Error('Failed to update game')
    }

    return data
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting game:', error)
      return false
    }

    return true
  }
}
