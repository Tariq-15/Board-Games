import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST() {
  try {
    console.log('Testing single game update by ID...')
    
    // Try to update the Azul game by ID instead of title
    const { data, error } = await supabase
      .from('games')
      .update({ 
        image_url: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0',
        updated_at: new Date().toISOString()
      })
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .select('id, title, image_url, updated_at')

    if (error) {
      console.error('Single update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update game',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    // Verify the update by reading the game again
    const { data: verifyData, error: verifyError } = await supabase
      .from('games')
      .select('id, title, image_url, updated_at')
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .single()

    if (verifyError) {
      return NextResponse.json({ 
        error: 'Failed to verify update',
        details: verifyError.message,
        updateResult: data
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Single game update test complete (by ID)',
      updateResult: data,
      verification: verifyData,
      success: true
    })

  } catch (error) {
    console.error('Single update test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
