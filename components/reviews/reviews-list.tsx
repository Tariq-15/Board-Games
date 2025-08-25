import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewService } from "@/lib/services/ReviewService"
import Link from "next/link"

interface ReviewsListProps {
  searchParams: {
    game?: string
    rating?: string
    page?: string
  }
}

export async function ReviewsList({ searchParams }: ReviewsListProps) {
  const reviewService = new ReviewService()
  const { reviews } = await reviewService.getAllReviews({ status: "approved", ...searchParams })

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt={review.userName} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{review.userName}</h3>
                  <p className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <Badge variant="outline">Game ID: {review.gameId}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{review.comment}</p>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </Button>
              <Link href={`/games/${review.gameId}`} className="text-sm text-primary hover:underline">
                View Game
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No reviews found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
