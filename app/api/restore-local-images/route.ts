import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    console.log('Restoring local game images now that layout is fixed...')
    
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

    // Map game titles to actual image files in /images/games folder
    const imageMapping: Record<string, { image: string; thumbnail: string }> = {
      'Pandemic': { 
        image: '/images/games/pandemic.jpeg', 
        thumbnail: '/images/games/pandemic.jpeg' 
      },
      'Wingspan': { 
        image: '/images/games/Wingspan.jpeg', 
        thumbnail: '/images/games/Wingspan.jpeg' 
      },
      'Ticket to Ride': { 
        image: '/images/games/ticket_to_ride.jpg', 
        thumbnail: '/images/games/ticket_to_ride.jpg' 
      },
      'Azul': { 
        image: '/images/games/azul.jpeg', 
        thumbnail: '/images/games/azul.jpeg' 
      },
      'Catan': { 
        image: '/images/games/Catan.jpeg', 
        thumbnail: '/images/games/Catan.jpeg' 
      },
      'Splendor': { 
        image: '/images/games/splendor.jpg', 
        thumbnail: '/images/games/splendor.jpg' 
      },
      'Codenames': { 
        image: '/placeholder.jpg', 
        thumbnail: '/placeholder.jpg' 
      }
    }

    const updateResults = []
    let successCount = 0
    let errorCount = 0

    // Update each game to use actual images
    for (const game of games) {
      const mapping = imageMapping[game.title]
      
      if (mapping) {
        try {
          const { error: updateError } = await supabaseAdmin
            .from('games')
            .update({ 
              image_url: mapping.image,
              thumbnail_url: mapping.thumbnail,
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
              newImage: mapping.image
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
      } else {
        // Game doesn't have a mapping, use placeholder
        try {
          const { error: updateError } = await supabaseAdmin
            .from('games')
            .update({ 
              image_url: '/placeholder.jpg',
              thumbnail_url: '/placeholder.jpg',
              updated_at: new Date().toISOString()
            })
            .eq('id', game.id)

          if (updateError) {
            console.error(`Error updating ${game.title} to placeholder:`, updateError)
            updateResults.push({
              title: game.title,
              status: 'error',
              error: updateError.message
            })
            errorCount++
          } else {
            updateResults.push({
              title: game.title,
              status: 'placeholder',
              oldImage: game.image_url,
              newImage: '/placeholder.jpg'
            })
            successCount++
          }
        } catch (err) {
          console.error(`Exception updating ${game.title} to placeholder:`, err)
          updateResults.push({
            title: game.title,
            status: 'error',
            error: err instanceof Error ? err.message : 'Unknown error'
          })
          errorCount++
        }
      }
    }

    return NextResponse.json({ 
      message: 'Restored local game images - layout issue is now fixed!',
      summary: {
        totalGames: games.length,
        successCount,
        errorCount,
        skippedCount: games.length - successCount - errorCount
      },
      results: updateResults,
      note: 'Images now use your local /images/games folder with proper layout'
    })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
