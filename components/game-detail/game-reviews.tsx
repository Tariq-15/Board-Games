"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Plus, MessageSquare } from "lucide-react"
import { ReviewService } from "@/lib/services/ReviewService"
import { ReviewForm } from "@/components/reviews/review-form"
import { Review } from "@/Model/Review"

interface GameReviewsProps {
  gameId: string
  gameTitle: string
}

export function GameReviews({ gameId, gameTitle }: GameReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const reviewService = new ReviewService()

  const loadReviews = async () => {
    try {
      setLoading(true)
      const reviewsData = await reviewService.getGameReviews(gameId)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [gameId])

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    loadReviews() // Reload reviews to show the new one
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          gameId={gameId}
          gameTitle={gameTitle}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Reviews ({reviews.length})
            </CardTitle>
            {!showReviewForm && (
              <Button 
                size="sm" 
                className="gap-2"
                onClick={() => setShowReviewForm(true)}
              >
                <Plus className="w-4 h-4" />
                Write Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your thoughts about this game!</p>
              <Button onClick={() => setShowReviewForm(true)}>
                Write the First Review
              </Button>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={review.user_name || 'User'} />
                      <AvatarFallback>
                        {(review.user_name || 'U')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user_name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                        {review.is_verified_purchase && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-2">{review.title}</h4>
                  <p className="text-sm leading-relaxed">{review.content}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}