import { ReviewController } from "@/Controller/ReviewController"
import type { ReviewFilters, PaginatedReviews } from "@/Controller/ReviewController"
import type { Review } from "@/Model/Review"

export class ReviewService {
  private reviewController: ReviewController

  constructor() {
    this.reviewController = new ReviewController()
  }

  public async getGameReviews(gameId: string): Promise<Review[]> {
    return await this.reviewController.getGameReviews(gameId)
  }

  public async getAllReviews(searchParams: ReviewFilters = {}): Promise<PaginatedReviews> {
    return await this.reviewController.getAllReviews(searchParams)
  }
}
