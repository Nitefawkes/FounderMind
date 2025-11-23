import { NextRequest, NextResponse } from 'next/server'
import { PersonaEngine } from '@/lib/ai/PersonaEngine'
import type { AdvisorPersona } from '@/lib/types/database.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { persona, decisionType, options, context } = body

    if (!persona || !decisionType || !options || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: persona, decisionType, options, context' },
        { status: 400 }
      )
    }

    const engine = new PersonaEngine()
    const recommendation = await engine.getDecisionRecommendation(
      persona as AdvisorPersona,
      decisionType,
      options,
      context
    )

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error('Error getting decision recommendation:', error)
    return NextResponse.json(
      { error: 'Failed to get decision recommendation' },
      { status: 500 }
    )
  }
}
