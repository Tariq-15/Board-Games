import { supabase } from '@/lib/supabase/client'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
  // Computed fields
  review_count?: number
  role?: string
}

export class UserModel {
  private static instance: UserModel

  private constructor() {}

  public static getInstance(): UserModel {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel()
    }
    return UserModel.instance
  }

  public async findAll(filters: { status?: string; search?: string } = {}): Promise<User[]> {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return data || []
  }

  public async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  public async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching user by email:', error)
      return null
    }

    return data
  }

  public async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }

    return data
  }

  public async update(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }

    return data
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return false
    }

    return true
  }
}
