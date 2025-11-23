'use client'

import { useState, useEffect } from 'react'
import type { Decision, DecisionOption } from '@/lib/simulation/DecisionEngine'
import type { AdvisorPersona } from '@/lib/types/database.types'
import type { AdvisorContext } from '@/lib/ai/PersonaEngine'

interface DecisionRecommendationsProps {
  decision: Decision
  context: AdvisorContext
}

interface Recommendation {
  persona: AdvisorPersona
  name: string
  avatar: string
  recommendation: string
  reasoning: string
  confidence: 'low' | 'medium' | 'high'
}

export function DecisionRecommendations({ decision, context }: DecisionRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [decision.type])

  const loadRecommendations = async () => {
    setIsLoading(true)
    const personas: Array<{ id: AdvisorPersona; name: string; avatar: string }> = [
      { id: 'ceo', name: 'Sarah Chen', avatar: '👩‍💼' },
      { id: 'cfo', name: 'David Park', avatar: '💼' },
      { id: 'cto', name: 'Marcus Rodriguez', avatar: '👨‍💻' },
    ]

    const recs: Recommendation[] = []

    for (const persona of personas) {
      try {
        const response = await fetch('/api/ai/decision-recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            persona: persona.id,
            decisionType: decision.type,
            options: decision.options.map((o) => ({
              label: o.label,
              description: o.description,
            })),
            context,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          recs.push({
            persona: persona.id,
            name: persona.name,
            avatar: persona.avatar,
            ...data,
          })
        }
      } catch (error) {
        console.error(`Failed to get recommendation from ${persona.name}:`, error)
      }
    }

    setRecommendations(recs)
    setIsLoading(false)
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-neon-green'
      case 'medium':
        return 'text-neon-blue'
      case 'low':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="cyber-card">
      <h3 className="text-xl font-bold text-neon-pink mb-4">Advisor Recommendations</h3>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="flex justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <p className="text-gray-400">Consulting advisors...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.persona}
              className="p-4 bg-cyber-dark border border-neon-blue/30 rounded-lg"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{rec.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neon-green">{rec.name}</span>
                    <span className={`text-xs uppercase ${getConfidenceColor(rec.confidence)}`}>
                      {rec.confidence} confidence
                    </span>
                  </div>
                  <p className="text-sm text-neon-blue mt-1">
                    Recommends: <strong>{rec.recommendation}</strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">{rec.reasoning}</p>
                </div>
              </div>
            </div>
          ))}

          {recommendations.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No recommendations available. Make sure your OPENAI_API_KEY is set.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
