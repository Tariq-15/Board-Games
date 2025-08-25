import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    console.log('Debugging table structure...')
    
    // Get detailed information about the games table
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .limit(1)
    
    if (gamesError) {
      return NextResponse.json({ 
        error: 'Failed to read games table',
        details: gamesError.message,
        code: gamesError.code
      }, { status: 500 })
    }

    // Try to get table schema information
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'games' })
      .select()

    // Try a simple update without select to see if that works
    const { error: simpleUpdateError } = await supabase
      .from('games')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')

    // Try to read the specific game we're trying to update
    const { data: specificGame, error: specificError } = await supabase
      .from('games')
      .select('*')
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .single()

    return NextResponse.json({ 
      message: 'Table debug information',
      tableData: {
        totalGames: games?.length || 0,
        sampleGame: games?.[0],
        specificGame,
        specificGameError: specificError?.message
      },
      updateTest: {
        simpleUpdateError: simpleUpdateError?.message,
        simpleUpdateSuccess: !simpleUpdateError
      },
      schemaInfo: {
        hasSchemaRPC: !schemaError,
        schemaError: schemaError?.message
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
