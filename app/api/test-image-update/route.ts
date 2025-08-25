import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST() {
  try {
    console.log('Testing image_url field update specifically...')
    
    // Try to update ONLY the image_url field
    const { data, error } = await supabase
      .from('games')
      .update({ 
        image_url: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0'
      })
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .select('id, title, image_url')

    if (error) {
      console.error('Image update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update image_url',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    // Verify the update immediately
    const { data: verifyData, error: verifyError } = await supabase
      .from('games')
      .select('id, title, image_url')
      .eq('id', '1361ee3f-1425-4a5e-a3f4-12c9742ceea8')
      .single()

    if (verifyError) {
      return NextResponse.json({ 
        error: 'Failed to verify image update',
        details: verifyError.message,
        updateResult: data
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Image URL update test complete',
      updateResult: data,
      verification: verifyData,
      success: true,
      analysis: {
        updateReturnedData: !!data && data.length > 0,
        imageUrlChanged: verifyData?.image_url !== '/images/games/azul.jpeg',
        newImageUrl: verifyData?.image_url
      }
    })

  } catch (error) {
    console.error('Image update test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
