'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { StartupMetrics } from '@/lib/types/database.types'

interface QuickActionsProps {
  metrics: StartupMetrics
  onAction: (action: string, details: any) => void
}

export function QuickActions({ metrics, onAction }: QuickActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const actions = [
    {
      id: 'quick_hire',
      icon: '👨‍💼',
      label: 'Quick Hire',
      description: 'Hire an engineer ($12k/mo)',
      color: 'neon-green',
      available: metrics.valuation > 50000,
      action: () => onAction('hire', { role: 'engineer', salary: 12000 }),
    },
    {
      id: 'marketing_boost',
      icon: '📣',
      label: 'Marketing Boost',
      description: 'Spend $5k on marketing',
      color: 'neon-blue',
      available: metrics.valuation > 5000,
      action: () => onAction('marketing', { budget: 5000 }),
    },
    {
      id: 'price_test',
      icon: '💰',
      label: 'Price +10%',
      description: 'Increase prices to test market',
      color: 'neon-pink',
      available: metrics.user_count > 100,
      action: () => onAction('price_change', { adjustment: 1.1 }),
    },
    {
      id: 'feature_sprint',
      icon: '⚡',
      label: 'Feature Sprint',
      description: 'Build requested feature fast',
      color: 'neon-green',
      available: metrics.team_size >= 3,
      action: () => onAction('build_feature', { type: 'requested', priority: 'high' }),
    },
  ]

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-neon-pink">⚡ Quick Actions</h3>
        <span className="text-xs text-gray-500">Fast decisions for busy founders</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.available) {
                setActiveAction(action.id)
                action.action()
                setTimeout(() => setActiveAction(null), 1000)
              }
            }}
            disabled={!action.available}
            className={`p-4 rounded-lg border transition-all ${
              action.available
                ? `border-${action.color}/30 hover:border-${action.color} hover:bg-${action.color}/10`
                : 'border-gray-600 opacity-50 cursor-not-allowed'
            } ${activeAction === action.id ? 'scale-95' : ''}`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-left">
              <p className={`text-sm font-semibold text-${action.color} mb-1`}>
                {action.label}
              </p>
              <p className="text-xs text-gray-400">{action.description}</p>
            </div>

            {!action.available && (
              <div className="mt-2 text-xs text-red-400">
                {action.id === 'quick_hire' && 'Need $50k+ valuation'}
                {action.id === 'marketing_boost' && 'Need $5k+ valuation'}
                {action.id === 'price_test' && 'Need 100+ users'}
                {action.id === 'feature_sprint' && 'Need 3+ team members'}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-cyber-dark rounded text-xs text-gray-400">
        💡 <strong>Tip:</strong> Quick actions execute immediately. For complex decisions, use
        the full decision panel or consult advisors.
      </div>
    </div>
  )
}
