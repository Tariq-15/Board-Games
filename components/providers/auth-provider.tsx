"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { AuthService, type LoginCredentials, type RegisterCredentials } from "@/lib/services/AuthService"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@/Model/User"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create auth service outside component to avoid recreation on every render
const authService = new AuthService()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Memoize the auth check function
  const checkAuth = useCallback(async () => {
    try {
      const { user: currentUser, error } = await authService.getCurrentUser()
      if (currentUser && !error) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check if user is already logged in
    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const { user: currentUser, error } = await authService.getCurrentUser()
            if (currentUser && !error) {
              setUser(currentUser)
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
          }
        } catch (error) {
          console.error('Auth state change error:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [isClient, checkAuth])

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user: loggedInUser, error } = await authService.login(credentials)
      
      if (error) {
        return { success: false, error }
      }

      if (loggedInUser) {
        setUser(loggedInUser)
        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { user: newUser, error } = await authService.register(credentials)
      
      if (error) {
        return { success: false, error }
      }

      if (newUser) {
        setUser(newUser)
        return { success: true }
      }

      return { success: false, error: 'Registration failed' }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      const { error } = await authService.logout()
      if (error) {
        console.error('Logout error:', error)
      }
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { success: false, error: 'No user logged in' }
    }

    try {
      const { user: updatedUser, error } = await authService.updateProfile(user.id, updates)
      
      if (error) {
        return { success: false, error }
      }

      if (updatedUser) {
        setUser(updatedUser)
        return { success: true }
      }

      return { success: false, error: 'Profile update failed' }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  // Don't render until we're on the client side
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
