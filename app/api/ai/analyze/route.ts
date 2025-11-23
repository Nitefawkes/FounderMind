import { NextRequest, NextResponse } from 'next/server'
import { PersonaEngine } from '@/lib/ai/PersonaEngine'
import type { AdvisorPersona } from '@/lib/types/database.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { persona, context } = body

    if (!persona || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: persona, context' },
        { status: 400 }
      )
    }

    const engine = new PersonaEngine()
    const analysis = await engine.analyzeMetrics(persona as AdvisorPersona, context)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in AI analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze metrics' },
      { status: 500 }
    )
  }
}
