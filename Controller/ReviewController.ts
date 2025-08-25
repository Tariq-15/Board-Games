import { ReviewModel, type Review } from "@/Model/Review"

export interface ReviewFilters {
  status?: string
  page?: string
  gameId?: string
}

export interface PaginatedReviews {
  reviews: Review[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export class ReviewController {
  private reviewModel: ReviewModel

  constructor() {
    this.reviewModel = ReviewModel.getInstance()
  }

  public async getGameReviews(gameId: string): Promise<Review[]> {
    return await this.reviewModel.findByGameId(gameId)
  }

  public async getAllReviews(filters: ReviewFilters = {}): Promise<PaginatedReviews> {
    const reviews = await this.reviewModel.findAll({ status: filters.status })

    const page = Number.parseInt(filters.page || "1")
    const pageSize = 10
    const totalPages = Math.ceil(reviews.length / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedReviews = reviews.slice(startIndex, startIndex + pageSize)

    return {
      reviews: paginatedReviews,
      totalPages,
      currentPage: page,
      totalCount: reviews.length,
    }
  }

  public async getReviewById(id: string): Promise<Review | null> {
    return await this.reviewModel.findById(id)
  }

  public async createReview(reviewData: Omit<Review, "id" | "created_at" | "updated_at">): Promise<Review> {
    return await this.reviewModel.create(reviewData)
  }

  public async updateReview(id: string, reviewData: Partial<Review>): Promise<Review> {
    return await this.reviewModel.update(id, reviewData)
  }

  public async deleteReview(id: string): Promise<boolean> {
    return await this.reviewModel.delete(id)
  }

  public async approveReview(id: string): Promise<Review> {
    return await this.reviewModel.update(id, { status: "approved" })
  }

  public async rejectReview(id: string): Promise<Review> {
    return await this.reviewModel.update(id, { status: "rejected" })
  }
}
