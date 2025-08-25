import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const googleDriveUrl = 'https://drive.usercontent.google.com/download?id=1JapbyP6OBu58gTqYj3Z0DEiIpmE1UY0S&export=view&authuser=0'
    
    // Test the Google Drive URL
    const response = await fetch(googleDriveUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const headers = Object.fromEntries(response.headers.entries())
    
    return NextResponse.json({ 
      message: 'Google Drive image test',
      url: googleDriveUrl,
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': headers['content-type'],
        'content-length': headers['content-length'],
        'content-security-policy': headers['content-security-policy'],
        'cross-origin-opener-policy': headers['cross-origin-opener-policy'],
        'x-content-security-policy': headers['x-content-security-policy']
      },
      analysis: {
        isAccessible: response.ok,
        hasCSP: !!headers['content-security-policy'],
        hasCORS: !!headers['access-control-allow-origin'],
        contentType: headers['content-type']
      }
    })

  } catch (error) {
    console.error('Google Drive image test error:', error)
    return NextResponse.json({ 
      error: 'Failed to test Google Drive URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
