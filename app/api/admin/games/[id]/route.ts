import { NextRequest, NextResponse } from 'next/server'
import { GameService } from '@/lib/services/GameService'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 })
    }

    const gameService = new GameService()
    const success = await gameService.deleteGame(id)

    if (success) {
      return NextResponse.json({ message: 'Game deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
