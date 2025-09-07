import { GameModel, type Game } from "@/Model/Game"
import { ReviewModel } from "@/Model/Review"

export interface GameFilters {
  search?: string
  category?: string
  players?: string
  playtime?: string
  page?: string
  status?: string
}

export interface PaginatedGames {
  games: Game[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export interface AdminStats {
  totalGames: number
  totalUsers: number
  totalReviews: number
  averageRating: number
  pendingReviews: number
  activeUsers: number
  gamesThisMonth: number
  reviewsThisMonth: number
}

export class GameController {
  private gameModel: GameModel
  private reviewModel: ReviewModel

  constructor() {
    this.gameModel = GameModel.getInstance()
    this.reviewModel = ReviewModel.getInstance()
  }

  public async getGames(filters: GameFilters = {}): Promise<PaginatedGames> {
    const games = await this.gameModel.findWithFilters(filters)

    const page = Number.parseInt(filters.page || "1")
    const pageSize = 9
    const totalPages = Math.ceil(games.length / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedGames = games.slice(startIndex, startIndex + pageSize)

    return {
      games: paginatedGames,
      totalPages,
      currentPage: page,
      totalCount: games.length,
    }
  }

  public async getFeaturedGames(): Promise<Game[]> {
    return await this.gameModel.findFeatured()
  }

  public async getGameById(id: string): Promise<Game | null> {
    return await this.gameModel.findById(id)
  }

  public async getGameByIdForAdmin(id: string): Promise<Game | null> {
    return await this.gameModel.findByIdForAdmin(id)
  }

  public async getAllGames(): Promise<Game[]> {
    return await this.gameModel.findAll()
  }

  public async searchGames(query: string): Promise<Game[]> {
    return await this.gameModel.search(query)
  }

  public async getSimilarGames(currentGame: Game): Promise<Game[]> {
    return await this.gameModel.findSimilar(currentGame)
  }

  public async createGame(gameData: Omit<Game, "id" | "created_at" | "updated_at">): Promise<Game> {
    return await this.gameModel.create(gameData)
  }

  public async updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
    return await this.gameModel.update(id, gameData)
  }

  public async deleteGame(id: string): Promise<boolean> {
    return await this.gameModel.delete(id)
  }

  public async getAdminStats(): Promise<AdminStats> {
    const games = await this.gameModel.findAll()
    const reviews = await this.reviewModel.findAll()

    const totalGames = games.length
    const totalReviews = reviews.length
    
    // Calculate average rating from reviews
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Mock additional stats for now - these could be enhanced with real database queries
    const totalUsers = 100 // This could be fetched from profiles table
    const activeUsers = 85
    const gamesThisMonth = Math.floor(totalGames * 0.1)
    const reviewsThisMonth = Math.floor(totalReviews * 0.15)

    return {
      totalGames,
      totalUsers,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      pendingReviews: 0, // No status field in current schema
      activeUsers,
      gamesThisMonth,
      reviewsThisMonth,
    }
  }
}
