import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    console.log('Updating Codenames to use placeholder image...')
    
    // Update Codenames to use placeholder
    const { data, error } = await supabaseAdmin
      .from('games')
      .update({ 
        image_url: '/placeholder.jpg',
        thumbnail_url: '/placeholder.jpg',
        updated_at: new Date().toISOString()
      })
      .eq('title', 'Codenames')
      .select('id, title, image_url, thumbnail_url')

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to update Codenames',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Codenames updated to use placeholder',
      game: data[0]
    })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
