import { NextRequest, NextResponse } from 'next/server'
import { PersonaEngine } from '@/lib/ai/PersonaEngine'
import type { AdvisorPersona, StartupMetrics, MarketConditions } from '@/lib/types/database.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { persona, message, context } = body

    if (!persona || !message || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: persona, message, context' },
        { status: 400 }
      )
    }

    const engine = new PersonaEngine()
    const advice = await engine.getAdvice(persona as AdvisorPersona, message, context)

    return NextResponse.json({ advice })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to get advice' },
      { status: 500 }
    )
  }
}
