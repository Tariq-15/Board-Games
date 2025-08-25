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

  public async getAllReviews(filters: ReviewFilters = {}): Promise<PaginatedReviews> {
    return await this.reviewController.getAllReviews(filters)
  }

  public async getReviewById(id: string): Promise<Review | null> {
    return await this.reviewController.getReviewById(id)
  }

  public async createReview(reviewData: Omit<Review, "id" | "created_at" | "updated_at">): Promise<Review> {
    return await this.reviewController.createReview(reviewData)
  }

  public async updateReview(id: string, reviewData: Partial<Review>): Promise<Review> {
    return await this.reviewController.updateReview(id, reviewData)
  }

  public async deleteReview(id: string): Promise<boolean> {
    return await this.reviewController.deleteReview(id)
  }

  public async approveReview(id: string): Promise<Review> {
    return await this.reviewController.approveReview(id)
  }

  public async rejectReview(id: string): Promise<Review> {
    return await this.reviewController.rejectReview(id)
  }
}
