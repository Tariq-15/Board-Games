import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    console.log('Testing with Picsum Photos image...')
    
    // Update Azul to use Picsum Photos image for testing
    const { data, error } = await supabaseAdmin
      .from('games')
      .update({ 
        image_url: 'https://fastly.picsum.photos/id/1042/1080/720.jpg?hmac=NoKqhjbayITDnem37XCOaG91r12LoxHD6-0cMqq-FU8',
        thumbnail_url: 'https://fastly.picsum.photos/id/1042/1080/720.jpg?hmac=NoKqhjbayITDnem37XCOaG91r12LoxHD6-0cMqq-FU8',
        updated_at: new Date().toISOString()
      })
      .eq('title', 'Azul')
      .select('id, title, image_url, thumbnail_url')

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to update Azul with Picsum image',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Azul updated to use Picsum Photos image for testing',
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
