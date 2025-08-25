import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if we can read from the database
    const { data: games, error: readError } = await supabase
      .from('games')
      .select('id, title, image_url')
      .limit(3)
    
    if (readError) {
      return NextResponse.json({ 
        error: 'Failed to read from database',
        details: readError.message,
        code: readError.code
      }, { status: 500 })
    }

    // Test 2: Try to update a single field to test write permissions
    const testGame = games?.[0]
    if (testGame) {
      const { error: updateError } = await supabase
        .from('games')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', testGame.id)

      if (updateError) {
        return NextResponse.json({ 
          error: 'Failed to write to database',
          details: updateError.message,
          code: updateError.code,
          readTest: 'PASSED',
          writeTest: 'FAILED'
        }, { status: 500 })
      }

      return NextResponse.json({ 
        message: 'Database connection test successful',
        readTest: 'PASSED',
        writeTest: 'PASSED',
        sampleData: games,
        connection: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      })
    }

    return NextResponse.json({ 
      message: 'Database connection test - read only',
      readTest: 'PASSED',
      writeTest: 'SKIPPED (no games found)',
      sampleData: games
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
