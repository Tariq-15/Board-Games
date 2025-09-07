import { redirect } from 'next/navigation'

// Admin email list - in production, this should be stored in the database
const ADMIN_EMAILS = [
  'admin@boardgames.com',
  'admin@example.com',
  // Add your admin email here for testing
]

export async function requireAdmin() {
  // For now, allow access without authentication
  // In production, implement proper server-side session checking
  
  // This is a temporary solution - in production you should:
  // 1. Check server-side session/cookies
  // 2. Verify JWT tokens
  // 3. Check database for user roles
  
  // For development/testing, we'll allow access without login
  return true
}

export async function isAdmin(): Promise<boolean> {
  try {
    // This function is for client-side use
    // Import supabase client when needed
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return false
    }

    return ADMIN_EMAILS.includes(user.email || '')
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}

export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS]
}
