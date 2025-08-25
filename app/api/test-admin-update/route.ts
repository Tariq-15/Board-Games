import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    console.log('Testing admin update (bypassing RLS)...')
    
    // Try to update using admin client that bypasses RLS
    const { data, error } = await supabaseAdmin
      .from('games')
      .update({ 
        image_url: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0'
      })
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .select('id, title, image_url')

    if (error) {
      console.error('Admin update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update with admin client',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('games')
      .select('id, title, image_url')
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .single()

    if (verifyError) {
      return NextResponse.json({ 
        error: 'Failed to verify admin update',
        details: verifyError.message,
        updateResult: data
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Admin update test complete',
      updateResult: data,
      verification: verifyData,
      success: true,
      analysis: {
        updateReturnedData: !!data && data.length > 0,
        imageUrlChanged: verifyData?.image_url !== '/images/games/azul.jpeg',
        newImageUrl: verifyData?.image_url,
        usingAdminClient: true
      }
    })

  } catch (error) {
    console.error('Admin update test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
