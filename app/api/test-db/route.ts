import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    console.log('Testing database connection and checking existing tables...')
    
    // Debug: Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Supabase URL exists:', !!supabaseUrl)
    console.log('Supabase Key exists:', !!supabaseKey)
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: 'Environment variables missing', 
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      }, { status: 500 })
    }
    
    // Check what tables exist
    const tablesToCheck = ['profiles', 'categories', 'games', 'reviews', 'game_media', 'wishlist']
    const existingTables: string[] = []
    const missingTables: string[] = []
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        if (!error) {
          existingTables.push(tableName)
          console.log(`✅ Table ${tableName} exists`)
        } else {
          missingTables.push(tableName)
          console.log(`❌ Table ${tableName} missing:`, error.message)
        }
      } catch (e) {
        missingTables.push(tableName)
        console.log(`❌ Table ${tableName} error:`, e)
      }
    }
    
    // Check if categories table has data
    let categoriesData = null
    if (existingTables.includes('categories')) {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .limit(5)
      
      if (!error) {
        categoriesData = data
      }
    }
    
    // Check if games table has data
    let gamesData = null
    if (existingTables.includes('games')) {
      const { data, error } = await supabase
        .from('games')
        .select('id, title')
        .limit(5)
      
      if (!error) {
        gamesData = data
      }
    }
    
    return NextResponse.json({ 
      message: 'Database status check complete',
      existingTables,
      missingTables,
      categoriesCount: categoriesData?.length || 0,
      gamesCount: gamesData?.length || 0,
      sampleCategories: categoriesData || [],
      sampleGames: gamesData || [],
      nextSteps: missingTables.length > 0 ? 
        `Run SQL script to create missing tables: ${missingTables.join(', ')}` :
        'All tables exist! You may need to insert sample data.'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('Testing direct database update...')
    
    // Try to update the Azul game directly
    const { data, error } = await supabase
      .from('games')
      .update({ 
        image_url: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0',
        thumbnail_url: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0',
        updated_at: new Date().toISOString()
      })
      .eq('title', 'Azul')
      .select()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update database',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Direct database update test complete',
      updatedGame: data,
      success: true
    })

  } catch (error) {
    console.error('Test database error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
