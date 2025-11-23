'use client'

import type { PersonaConfig } from '@/lib/ai/PersonaEngine'

interface PersonaCardProps {
  persona: PersonaConfig
  isActive?: boolean
  onClick?: () => void
  showInsights?: boolean
  insights?: {
    concerns: string[]
    opportunities: string[]
  }
}

export function PersonaCard({ persona, isActive, onClick, showInsights, insights }: PersonaCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cyber-card cursor-pointer transition-all duration-300 ${
        isActive
          ? 'border-neon-green shadow-[0_0_30px_rgba(0,255,178,0.3)]'
          : 'hover:border-neon-blue/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-5xl">{persona.avatar}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-neon-green">{persona.name}</h3>
          <p className="text-sm text-gray-400">{persona.title}</p>
        </div>
        {isActive && (
          <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse-glow"></div>
        )}
      </div>

      {/* Expertise */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">EXPERTISE</p>
        <div className="flex flex-wrap gap-2">
          {persona.expertise.slice(0, 3).map((exp) => (
            <span
              key={exp}
              className="px-2 py-1 bg-cyber-dark border border-neon-blue/30 rounded text-xs text-neon-blue"
            >
              {exp}
            </span>
          ))}
          {persona.expertise.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{persona.expertise.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Insights */}
      {showInsights && insights && (
        <div className="border-t border-cyber-gray pt-4 mt-4">
          {insights.concerns.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-red-400 mb-1">⚠️ CONCERNS</p>
              <ul className="text-xs text-gray-400 space-y-1">
                {insights.concerns.slice(0, 2).map((concern, i) => (
                  <li key={i} className="truncate">
                    • {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {insights.opportunities.length > 0 && (
            <div>
              <p className="text-xs text-neon-green mb-1">✨ OPPORTUNITIES</p>
              <ul className="text-xs text-gray-400 space-y-1">
                {insights.opportunities.slice(0, 2).map((opp, i) => (
                  <li key={i} className="truncate">
                    • {opp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* When to Ask */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1">Best for:</p>
        <p className="text-gray-400">{persona.when_to_ask[0]}</p>
      </div>
    </div>
  )
}
