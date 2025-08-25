import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    console.log('Updating image URLs to use Google Drive links (admin client)...')
    
    // Get all games from database using admin client
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

    // Define the mapping of game titles to Google Drive image URLs
    // You can replace these with your actual Google Drive image links
    const imageMapping: Record<string, { image: string; thumbnail: string }> = {
      'Pandemic': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      },
      'Wingspan': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      },
      'Ticket to Ride': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      },
      'Azul': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      },
      'Catan': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      },
      'Splendor': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      },
      'Codenames': { 
        image: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0', 
        thumbnail: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0' 
      }
    }

    const updateResults = []
    let successCount = 0
    let errorCount = 0

    // Update each game's image URLs using admin client
    for (const game of games) {
      const mapping = imageMapping[game.title]
      
      if (mapping) {
        // Game has a Google Drive image
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
              image_url: '/placeholder.svg',
              thumbnail_url: '/placeholder.svg',
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
              newImage: '/placeholder.svg'
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
      message: 'Image URL update complete - now using Google Drive links (admin client)',
      summary: {
        totalGames: games.length,
        successCount,
        errorCount,
        skippedCount: games.length - successCount - errorCount
      },
      results: updateResults
    })

  } catch (error) {
    console.error('Image URL update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
