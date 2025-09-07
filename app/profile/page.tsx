"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/providers/auth-provider"
import { Edit, Save, X, User, Mail, Calendar, MapPin, BookOpen, Star, Heart, Plus, MessageSquare, Trash2 } from "lucide-react"
import { WishlistService } from "@/lib/services/WishlistService"
import { WishlistItem } from "@/Model/Wishlist"
import { ReviewService } from "@/lib/services/ReviewService"
import { Review } from "@/Model/Review"
import Link from "next/link"


// Using Review from Model/Review.ts

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || ""
  })

  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const wishlistService = new WishlistService()

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const reviewService = new ReviewService()

  const handleSave = async () => {
    if (user) {
      const result = await updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      })
      
      if (result.success) {
        setIsEditing(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      bio: user?.bio || "",
      avatar_url: user?.avatar_url || ""
    })
    setIsEditing(false)
  }

  // Load wishlist and reviews on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setWishlistLoading(false)
        setReviewsLoading(false)
        return
      }

      try {
        // Load wishlist
        const wishlistResult = await wishlistService.getUserWishlist(user.id)
        if (wishlistResult.success && wishlistResult.data) {
          setWishlist(wishlistResult.data)
        }

        // Load reviews
        const userReviews = await reviewService.getUserReviews(user.id)
        setReviews(userReviews)

      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setWishlistLoading(false)
        setReviewsLoading(false)
      }
    }

    loadUserData()
  }, [user?.id])

  // Wishlist functions
  const removeFromWishlist = async (gameId: string) => {
    if (!user?.id) return

    try {
      const result = await wishlistService.removeFromWishlist(user.id, gameId)
      if (result.success) {
        setWishlist(wishlist.filter(item => item.game_id !== gameId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  // Review functions
  const deleteReview = async (reviewId: string) => {
    if (!user?.id) return

    try {
      const result = await reviewService.deleteReview(reviewId)
      if (result.success) {
        setReviews(reviews.filter(review => review.id !== reviewId))
      } else {
        console.error('Failed to delete review:', result.error)
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your profile.
            </p>
            <Button asChild>
              <a href="/auth/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback className="text-2xl">
                  {user.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl">{user.full_name}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center mt-4">
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="Enter avatar image URL"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p className="text-muted-foreground">{user.full_name || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
                {user.bio && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Bio</p>
                      <p className="text-muted-foreground">{user.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Your Board Game Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Games Owned</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                <div className="text-sm text-muted-foreground">Reviews Written</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{wishlist.length}</div>
                <div className="text-sm text-muted-foreground">Wishlist Items</div>
              </div>
            </div>
            
            {/* Test button */}
            <div className="mt-4 text-center">
              <Button 
                onClick={() => alert('Test button works!')}
                variant="outline"
                size="sm"
              >
                Test Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wishlistLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading wishlist...</p>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-4">Browse games and add them to your wishlist</p>
                <Button asChild>
                  <Link href="/games">Browse Games</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.game?.image_url && (
                        <img 
                          src={item.game.image_url} 
                          alt={item.game.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <Link href={`/games/${item.game_id}`}>
                          <h4 className="font-medium hover:text-primary transition-colors">
                            {item.game?.title || 'Unknown Game'}
                          </h4>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.game?.category?.name && (
                            <Badge variant="outline" className="mr-2">
                              {item.game.category.name}
                            </Badge>
                          )}
                          Added on {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWishlist(item.game_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              My Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-sm mb-4">Share your thoughts about the games you've played!</p>
                <Button asChild>
                  <Link href="/games">Browse Games</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            href={`/games/${review.game_id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {review.game_title || 'Unknown Game'}
                          </Link>
                          {review.is_verified_purchase && (
                            <Badge variant="outline" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-lg mb-1">{review.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReview(review.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed">{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Game Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Strategy
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Family
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Party
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Euro
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Abstract
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Click on categories to add them to your favorites
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
