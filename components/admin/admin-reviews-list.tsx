import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Check, X, MoreHorizontal } from "lucide-react"
import { ReviewService } from "@/lib/services/ReviewService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminReviewsListProps {
  searchParams: {
    status?: string
    page?: string
  }
}

export async function AdminReviewsList({ searchParams }: AdminReviewsListProps) {
  const reviewService = new ReviewService()
  const { reviews } = await reviewService.getAllReviews(searchParams)

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={review.userName} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{review.userName}</h3>
                    <Badge variant="outline">{review.userEmail}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Game ID: {review.gameId} • {review.createdAt.toLocaleDateString()}
                  </p>
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
                <Badge
                  variant={
                    review.status === "approved" ? "default" : review.status === "pending" ? "secondary" : "destructive"
                  }
                >
                  {review.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{review.comment}</p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{review.helpful} people found this helpful</div>
              <div className="flex items-center space-x-2">
                {review.status === "pending" && (
                  <>
                    <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Review</DropdownMenuItem>
                    <DropdownMenuItem>View Game</DropdownMenuItem>
                    <DropdownMenuItem>Contact User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete Review</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
