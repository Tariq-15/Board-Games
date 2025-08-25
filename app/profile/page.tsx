"use client"

import { useState } from "react"
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

interface WishlistItem {
  id: string
  gameTitle: string
  addedDate: string
}

interface Review {
  id: string
  gameTitle: string
  rating: number
  comment: string
  reviewDate: string
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || ""
  })

  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    { id: "1", gameTitle: "Azul", addedDate: "2024-01-15" },
    { id: "2", gameTitle: "Pandemic", addedDate: "2024-01-10" }
  ])
  const [showAddWishlist, setShowAddWishlist] = useState(false)
  const [newWishlistItem, setNewWishlistItem] = useState("")

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    { 
      id: "1", 
      gameTitle: "Wingspan", 
      rating: 5, 
      comment: "Amazing bird-themed strategy game with beautiful artwork!", 
      reviewDate: "2024-01-12" 
    }
  ])
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({
    gameTitle: "",
    rating: 5,
    comment: ""
  })

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

  // Wishlist functions
  const addToWishlist = () => {
    console.log('addToWishlist called, newWishlistItem:', newWishlistItem)
    if (newWishlistItem.trim()) {
      const newItem: WishlistItem = {
        id: Date.now().toString(),
        gameTitle: newWishlistItem.trim(),
        addedDate: new Date().toISOString().split('T')[0]
      }
      console.log('Adding new item:', newItem)
      setWishlist([...wishlist, newItem])
      setNewWishlistItem("")
      setShowAddWishlist(false)
      console.log('Wishlist updated, new length:', wishlist.length + 1)
    } else {
      console.log('newWishlistItem is empty or only whitespace')
    }
  }

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  // Review functions
  const addReview = () => {
    if (newReview.gameTitle.trim() && newReview.comment.trim()) {
      const review: Review = {
        id: Date.now().toString(),
        gameTitle: newReview.gameTitle.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        reviewDate: new Date().toISOString().split('T')[0]
      }
      setReviews([...reviews, review])
      setNewReview({ gameTitle: "", rating: 5, comment: "" })
      setShowAddReview(false)
    }
  }

  const removeReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id))
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
            {showAddWishlist && (
              <div className="flex gap-2 p-4 bg-muted rounded-lg">
                <Input
                  placeholder="Enter game title..."
                  value={newWishlistItem}
                  onChange={(e) => setNewWishlistItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addToWishlist()}
                />
                <Button onClick={() => {
                  console.log('Add button clicked')
                  addToWishlist()
                }} size="sm">
                  Add
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddWishlist(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {/* Debug info */}
            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
              Debug: showAddWishlist = {showAddWishlist.toString()}, 
              newWishlistItem = "{newWishlistItem}", 
              wishlist length = {wishlist.length}
            </div>
            
            {wishlist.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your wishlist is empty</p>
                <p className="text-sm">Add games you'd like to play!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.gameTitle}</p>
                      <p className="text-sm text-muted-foreground">Added: {item.addedDate}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-500 hover:text-red-700"
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
              My Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddReview && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <Label htmlFor="gameTitle">Game Title</Label>
                  <Input
                    id="gameTitle"
                    placeholder="Enter game title..."
                    value={newReview.gameTitle}
                    onChange={(e) => setNewReview({ ...newReview, gameTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(newReview.rating)}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {newReview.rating}/5
                    </span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:bg-background rounded"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReview.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Review</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts about this game..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addReview} size="sm">
                    Submit Review
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddReview(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reviews yet</p>
                <p className="text-sm">Share your thoughts about the games you've played!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.gameTitle}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            {review.reviewDate}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReview(review.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm">{review.comment}</p>
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
