'use client'

import { useState } from 'react'
import type { DecisionType } from '@/lib/types/database.types'

interface Decision {
  id: string
  type: DecisionType
  choice: string
  outcome: any
  impact: number
  timestamp: number
  success: boolean
}

interface DecisionHistoryProps {
  decisions: Decision[]
}

export function DecisionHistory({ decisions }: DecisionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'success' | 'failure'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'impact'>('recent')

  const decisionIcons: Record<DecisionType, string> = {
    hire: '👨‍💼',
    fire: '❌',
    pivot: '🔄',
    fundraise: '💰',
    build_feature: '⚙️',
    marketing_campaign: '📣',
    price_change: '💵',
    partnership: '🤝',
    acquisition: '🏢',
    expansion: '🌍',
  }

  const filteredDecisions = decisions
    .filter((d) => {
      if (filter === 'all') return true
      return filter === 'success' ? d.success : !d.success
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return b.timestamp - a.timestamp
      }
      return Math.abs(b.impact) - Math.abs(a.impact)
    })

  // Analytics
  const successRate =
    decisions.length > 0
      ? (decisions.filter((d) => d.success).length / decisions.length) * 100
      : 0
  const totalImpact = decisions.reduce((sum, d) => sum + d.impact, 0)
  const decisionsByType = decisions.reduce(
    (acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="cyber-card">
      <h2 className="text-2xl font-bold text-neon-green mb-6">📊 Decision Analytics</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-cyber-dark rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Total Decisions</p>
          <p className="text-2xl font-bold text-white">{decisions.length}</p>
        </div>
        <div className="p-4 bg-cyber-dark rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-neon-green">{successRate.toFixed(0)}%</p>
        </div>
        <div className="p-4 bg-cyber-dark rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Net Impact</p>
          <p
            className={`text-2xl font-bold ${
              totalImpact >= 0 ? 'text-neon-green' : 'text-red-500'
            }`}
          >
            {totalImpact >= 0 ? '+' : ''}
            {totalImpact}
          </p>
        </div>
      </div>

      {/* Decision Breakdown */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-3">Decisions by Type</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(decisionsByType).map(([type, count]) => (
            <div
              key={type}
              className="px-3 py-2 bg-cyber-dark border border-neon-blue/30 rounded flex items-center gap-2"
            >
              <span className="text-lg">{decisionIcons[type as DecisionType]}</span>
              <span className="text-sm text-white capitalize">{type.replace('_', ' ')}</span>
              <span className="text-xs text-gray-500">×{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              filter === 'all'
                ? 'bg-neon-blue text-cyber-darker'
                : 'bg-cyber-dark text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              filter === 'success'
                ? 'bg-neon-green text-cyber-darker'
                : 'bg-cyber-dark text-gray-400 hover:text-white'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilter('failure')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              filter === 'failure'
                ? 'bg-red-500 text-white'
                : 'bg-cyber-dark text-gray-400 hover:text-white'
            }`}
          >
            Failure
          </button>
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-2 rounded text-sm ${
              sortBy === 'recent' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy('impact')}
            className={`px-3 py-2 rounded text-sm ${
              sortBy === 'impact' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400'
            }`}
          >
            Impact
          </button>
        </div>
      </div>

      {/* Decision List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredDecisions.map((decision) => (
          <div
            key={decision.id}
            className={`p-4 rounded-lg border ${
              decision.success
                ? 'border-neon-green/30 bg-neon-green/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{decisionIcons[decision.type]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white capitalize">
                    {decision.type.replace('_', ' ')}
                  </h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      decision.success ? 'bg-neon-green/20 text-neon-green' : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {decision.success ? '✓ Success' : '✗ Failed'}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{decision.choice}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{new Date(decision.timestamp).toLocaleString()}</span>
                  <span
                    className={decision.impact >= 0 ? 'text-neon-green' : 'text-red-500'}
                  >
                    Impact: {decision.impact >= 0 ? '+' : ''}
                    {decision.impact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDecisions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No decisions match your filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
