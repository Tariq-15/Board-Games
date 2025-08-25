import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Plus } from "lucide-react"
import { ReviewService } from "@/lib/services/ReviewService"

interface GameReviewsProps {
  gameId: string
}

export async function GameReviews({ gameId }: GameReviewsProps) {
  const reviewService = new ReviewService()
  const reviews = await reviewService.getGameReviews(gameId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Write Review
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={review.userName} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString()}</p>
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
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No reviews yet</p>
            <Button>Be the first to review</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
