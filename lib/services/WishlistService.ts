import { WishlistModel, WishlistItem } from "@/Model/Wishlist"

export class WishlistService {
  private wishlistModel: WishlistModel

  constructor() {
    this.wishlistModel = new WishlistModel()
  }

  async addToWishlist(userId: string, gameId: string): Promise<{ success: boolean; error?: string }> {
    return await this.wishlistModel.addToWishlist(userId, gameId)
  }

  async removeFromWishlist(userId: string, gameId: string): Promise<{ success: boolean; error?: string }> {
    return await this.wishlistModel.removeFromWishlist(userId, gameId)
  }

  async getUserWishlist(userId: string): Promise<{ success: boolean; data?: WishlistItem[]; error?: string }> {
    return await this.wishlistModel.getUserWishlist(userId)
  }

  async isInWishlist(userId: string, gameId: string): Promise<{ success: boolean; isInWishlist?: boolean; error?: string }> {
    return await this.wishlistModel.isInWishlist(userId, gameId)
  }
}
