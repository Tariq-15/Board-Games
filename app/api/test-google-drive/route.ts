import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Google Drive image URLs
    const testImages = [
      {
        title: 'Test Image 1',
        url: 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0'
      },
      {
        title: 'Test Image 2', 
        url: 'https://drive.google.com/uc?export=view&id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S'
      }
    ]

    return NextResponse.json({ 
      message: 'Google Drive image test',
      testImages,
      instructions: [
        'These URLs should work in your GameImage component',
        'The first URL is the direct usercontent format you provided',
        'The second URL is the converted format that the component generates'
      ]
    })

  } catch (error) {
    console.error('Google Drive test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
