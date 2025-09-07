"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { WishlistService } from "@/lib/services/WishlistService"
import { useToast } from "@/hooks/use-toast"

interface WishlistButtonProps {
  gameId: string
  gameTitle: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  className?: string
  showText?: boolean
}

export function WishlistButton({ 
  gameId, 
  gameTitle, 
  size = "default", 
  variant = "default",
  className = "",
  showText = true 
}: WishlistButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)

  const wishlistService = new WishlistService()

  // Check if game is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.id) {
        setIsCheckingStatus(false)
        return
      }

      try {
        const result = await wishlistService.isInWishlist(user.id, gameId)
        if (result.success) {
          setIsInWishlist(result.isInWishlist || false)
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkWishlistStatus()
  }, [user?.id, gameId])

  const handleWishlistToggle = async () => {
    console.log('Wishlist button clicked - user:', user)
    console.log('Wishlist button clicked - gameId:', gameId)
    console.log('Wishlist button clicked - isInWishlist:', isInWishlist)
    
    if (!user) {
      console.log('No user, showing login required toast')
      toast({
        title: "Login Required",
        description: "Please log in to add games to your wishlist.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        console.log('Removing from wishlist')
        const result = await wishlistService.removeFromWishlist(user.id, gameId)
        console.log('Remove result:', result)
        
        if (result.success) {
          setIsInWishlist(false)
          toast({
            title: "Removed from Wishlist",
            description: `${gameTitle} has been removed from your wishlist.`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to remove from wishlist.",
            variant: "destructive"
          })
        }
      } else {
        console.log('Adding to wishlist')
        const result = await wishlistService.addToWishlist(user.id, gameId)
        console.log('Add result:', result)
        
        if (result.success) {
          setIsInWishlist(true)
          toast({
            title: "Added to Wishlist",
            description: `${gameTitle} has been added to your wishlist!`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add to wishlist.",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingStatus) {
    return (
      <Button 
        size={size} 
        variant={variant} 
        className={`cursor-not-allowed opacity-50 ${className}`}
        disabled
      >
        <Heart className="w-4 h-4" />
        {showText && "Loading..."}
      </Button>
    )
  }

  return (
    <Button 
      size={size} 
      variant={variant} 
      className={`cursor-pointer hover:scale-105 transition-transform ${className}`}
      onClick={handleWishlistToggle}
      disabled={isLoading}
    >
      <Heart 
        className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  )
}
