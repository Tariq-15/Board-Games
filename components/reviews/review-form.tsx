"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, X, Send } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ReviewService } from "@/lib/services/ReviewService"

interface ReviewFormProps {
  gameId: string
  gameTitle: string
  onReviewSubmitted?: () => void
  onCancel?: () => void
}

export function ReviewForm({ gameId, gameTitle, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    isVerifiedPurchase: false
  })

  const reviewService = new ReviewService()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to write a review.",
        variant: "destructive"
      })
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and review content.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        game_id: gameId,
        user_id: user.id,
        rating: formData.rating,
        title: formData.title.trim(),
        content: formData.content.trim(),
        is_verified_purchase: formData.isVerifiedPurchase,
        status: "approved" // Auto-approve for now, can be changed to "pending" for moderation
      }

      const result = await reviewService.createReview(reviewData)
      
      if (result.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        })
        
        // Reset form
        setFormData({
          title: "",
          content: "",
          rating: 5,
          isVerifiedPurchase: false
        })
        
        // Notify parent component
        onReviewSubmitted?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Review submission error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
      />
    ))
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4">Please log in to write a review for {gameTitle}.</p>
          <Button asChild>
            <a href="/auth/login">Login</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Write a Review</CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Share your thoughts about <strong>{gameTitle}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {renderStars(formData.rating)}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating}/5 stars
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              placeholder="Summarize your review in a few words..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Review</Label>
            <Textarea
              id="content"
              placeholder="Tell us about your experience with this game. What did you like? What could be improved?"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              maxLength={1000}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/1000 characters
            </p>
          </div>

          {/* Verified Purchase */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified"
              checked={formData.isVerifiedPurchase}
              onChange={(e) => setFormData({ ...formData, isVerifiedPurchase: e.target.checked })}
              disabled={isSubmitting}
              className="rounded border-gray-300"
            />
            <Label htmlFor="verified" className="text-sm">
              I own this game
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



