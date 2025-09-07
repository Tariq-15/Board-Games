import { ReviewModel, Review } from "@/Model/Review"

export interface CreateReviewData {
  game_id: string
  user_id: string
  rating: number
  title: string
  content: string
  is_verified_purchase?: boolean
  status?: string
}

export interface ReviewServiceResponse {
  success: boolean
  data?: Review
  error?: string
}

export class ReviewService {
  private reviewModel: ReviewModel

  constructor() {
    this.reviewModel = ReviewModel.getInstance()
  }

  async createReview(reviewData: CreateReviewData): Promise<ReviewServiceResponse> {
    try {
      console.log('Creating review:', reviewData)
      
      const review = await this.reviewModel.create(reviewData)
      
      console.log('Review created successfully:', review.id)
      return { success: true, data: review }
    } catch (error) {
      console.error('Error creating review:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create review' 
      }
    }
  }

  async getGameReviews(gameId: string): Promise<Review[]> {
    try {
      console.log('Getting reviews for game:', gameId)
      const reviews = await this.reviewModel.findByGameId(gameId)
      console.log('Found reviews:', reviews.length)
      return reviews
    } catch (error) {
      console.error('Error fetching game reviews:', error)
      return []
    }
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      console.log('Getting reviews for user:', userId)
      const allReviews = await this.reviewModel.findAll()
      const userReviews = allReviews.filter(review => review.user_id === userId)
      console.log('Found user reviews:', userReviews.length)
      return userReviews
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      return []
    }
  }

  async updateReview(reviewId: string, updates: Partial<Review>): Promise<ReviewServiceResponse> {
    try {
      console.log('Updating review:', reviewId, updates)
      
      const review = await this.reviewModel.update(reviewId, updates)
      
      console.log('Review updated successfully:', review.id)
      return { success: true, data: review }
    } catch (error) {
      console.error('Error updating review:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update review' 
      }
    }
  }

  async deleteReview(reviewId: string): Promise<ReviewServiceResponse> {
    try {
      console.log('Deleting review:', reviewId)
      
      const success = await this.reviewModel.delete(reviewId)
      
      if (success) {
        console.log('Review deleted successfully:', reviewId)
        return { success: true }
      } else {
        return { success: false, error: 'Failed to delete review' }
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete review' 
      }
    }
  }

  async getReviewById(reviewId: string): Promise<Review | null> {
    try {
      console.log('Getting review by ID:', reviewId)
      const review = await this.reviewModel.findById(reviewId)
      return review
    } catch (error) {
      console.error('Error fetching review by ID:', error)
      return null
    }
  }
}