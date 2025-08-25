import { supabase } from '@/lib/supabase/client'
import type { User } from '@/models/User'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

export class AuthService {
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        console.error('Supabase auth error:', error)
        return { user: null, error: error.message }
      }

      if (!data.user) {
        console.error('No user data returned from auth')
        return { user: null, error: 'Login failed - no user data' }
      }

      console.log('User authenticated successfully:', data.user.id)

      // Get user profile
      let profile = null
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        console.error('Profile error details:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        })
        
        // Create profile if it doesn't exist
        console.log('Attempting to create profile for user:', data.user.id)
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || 'User',
            avatar_url: '/placeholder-user.jpg',
            bio: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          console.error('Create profile error details:', {
            message: createError.message,
            details: createError.details,
            hint: createError.hint,
            code: createError.code
          })
          return { user: null, error: `Failed to create user profile: ${createError.message}` }
        }
        
        console.log('Profile created successfully:', newProfile)
        profile = newProfile
      } else {
        console.log('Profile found:', profileData)
        profile = profileData
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: profile.full_name || data.user.user_metadata?.full_name || 'User',
        avatar_url: profile.avatar_url || '/placeholder-user.jpg',
        bio: profile.bio || '',
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      }

      console.log('User object created:', user)
      return { user, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { user: null, error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'Registration failed' }
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          email: credentials.email,
          full_name: credentials.fullName,
          avatar_url: '/placeholder-user.jpg',
          bio: ''
        }])

      if (profileError) {
        console.error('Error creating profile:', profileError)
        return { user: null, error: 'Profile creation failed' }
      }

      const user: User = {
        id: data.user.id,
        email: credentials.email,
        full_name: credentials.fullName,
        avatar_url: '/placeholder-user.jpg',
        bio: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return { user, error: null }
    } catch (error) {
      console.error('Registration error:', error)
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  public async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { error: error.message }
      }
      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  public async getCurrentUser(): Promise<AuthResponse> {
    try {
      // First check if there's an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session check error:', sessionError)
        return { user: null, error: sessionError.message }
      }

      if (!session) {
        // No active session, return null user without error
        return { user: null, error: null }
      }

      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        console.error('Get user error:', error)
        return { user: null, error: error?.message || 'No user found' }
      }

      console.log('Current user found:', user.id)

      // Get user profile
      let profile = null
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        console.error('Profile error details:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        })
        
        // Create profile if it doesn't exist
        console.log('Attempting to create profile for user:', user.id)
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'User',
            avatar_url: '/placeholder-user.jpg',
            bio: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          console.error('Create profile error details:', {
            message: createError.message,
            details: createError.details,
            hint: createError.hint,
            code: createError.code
          })
          return { user: null, error: `Failed to create user profile: ${createError.message}` }
        }
        
        console.log('Profile created successfully:', newProfile)
        profile = newProfile
      } else {
        console.log('Profile found:', profileData)
        profile = profileData
      }

      const userProfile: User = {
        id: user.id,
        email: user.email || '',
        full_name: profile.full_name || 'User',
        avatar_url: profile.avatar_url || '/placeholder-user.jpg',
        bio: profile.bio || '',
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      }

      console.log('User profile created:', userProfile)
      return { user: userProfile, error: null }
    } catch (error) {
      console.error('Get current user error:', error)
      // Don't throw error, just return null user
      return { user: null, error: null }
    }
  }

  public async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      const user: User = {
        id: data.id,
        email: data.email || '',
        full_name: data.full_name || 'User',
        avatar_url: data.avatar_url || '/placeholder-user.jpg',
        bio: data.bio || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { user, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { user: null, error: 'An unexpected error occurred' }
    }
  }
}
