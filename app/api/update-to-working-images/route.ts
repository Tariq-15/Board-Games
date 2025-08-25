import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    console.log('Updating to working image URLs...')
    
    // Get all games from database
    const { data: games, error: fetchError } = await supabaseAdmin
      .from('games')
      .select('id, title, image_url, thumbnail_url')
    
    if (fetchError) {
      return NextResponse.json({ 
        error: 'Failed to fetch games',
        details: fetchError.message
      }, { status: 500 })
    }

    if (!games || games.length === 0) {
      return NextResponse.json({ 
        message: 'No games found in database'
      })
    }

    // Use working placeholder images that don't have CORS/CSP issues
    const workingImageUrl = '/placeholder.jpg' // This exists in your public folder
    
    const updateResults = []
    let successCount = 0
    let errorCount = 0

    // Update each game to use working images
    for (const game of games) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from('games')
          .update({ 
            image_url: workingImageUrl,
            thumbnail_url: workingImageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', game.id)

        if (updateError) {
          console.error(`Error updating ${game.title}:`, updateError)
          updateResults.push({
            title: game.title,
            status: 'error',
            error: updateError.message
          })
          errorCount++
        } else {
          updateResults.push({
            title: game.title,
            status: 'success',
            oldImage: game.image_url,
            newImage: workingImageUrl
          })
          successCount++
        }
      } catch (err) {
        console.error(`Exception updating ${game.title}:`, err)
        updateResults.push({
          title: game.title,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
        errorCount++
      }
    }

    return NextResponse.json({ 
      message: 'Updated to working image URLs',
      summary: {
        totalGames: games.length,
        successCount,
        errorCount,
        skippedCount: games.length - successCount - errorCount
      },
      results: updateResults,
      note: 'Images now use local placeholder.jpg which works without CORS/CSP issues'
    })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
