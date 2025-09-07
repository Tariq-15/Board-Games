import type { User } from "@/Model/User"
import { UserModel } from "@/Model/User"
import { supabase } from "@/lib/supabase/client"

export interface UserFilters {
  status?: string
  page?: string
  search?: string
}

export interface PaginatedUsers {
  users: User[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export class UserService {
  private userModel: UserModel

  constructor() {
    this.userModel = UserModel.getInstance()
  }

  public async getAllUsers(searchParams: UserFilters = {}): Promise<PaginatedUsers> {
    try {
      // Get users from database with filters
      const filters = {
        search: searchParams.search,
        status: searchParams.status
      }
      
      const users = await this.userModel.findAll(filters)
      
      // Get review counts for each user
      const usersWithReviewCounts = await Promise.all(
        users.map(async (user) => {
          const { count } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'approved')
          
          return {
            ...user,
            review_count: count || 0,
            role: 'user' // Default role, can be enhanced later with admin roles
          }
        })
      )

      const page = Number.parseInt(searchParams.page || "1")
      const pageSize = 10
      const totalPages = Math.ceil(usersWithReviewCounts.length / pageSize)
      const startIndex = (page - 1) * pageSize
      const paginatedUsers = usersWithReviewCounts.slice(startIndex, startIndex + pageSize)

      return {
        users: paginatedUsers,
        totalPages,
        currentPage: page,
        totalCount: usersWithReviewCounts.length,
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return {
        users: [],
        totalPages: 0,
        currentPage: 1,
        totalCount: 0,
      }
    }
  }

  public async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id)
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      return null
    }
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      return await this.userModel.update(id, userData)
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error("Failed to update user")
    }
  }

  public async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.userModel.delete(id)
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }
}
