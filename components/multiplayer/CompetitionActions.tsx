'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface Player {
  id: string
  username: string
  startupName: string
  metrics: any
}

interface CompetitionActionsProps {
  currentPlayerId: string
  opponents: Player[]
  onAction: (action: { type: string; target?: string; details: any }) => void
  allowPoaching: boolean
  allowSabotage: boolean
}

export function CompetitionActions({
  currentPlayerId,
  opponents,
  onAction,
  allowPoaching,
  allowSabotage,
}: CompetitionActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [actionDetails, setActionDetails] = useState<any>({})

  const handleExecute = () => {
    if (!selectedAction) return

    onAction({
      type: selectedAction,
      target: selectedTarget || undefined,
      details: actionDetails,
    })

    // Reset
    setSelectedAction(null)
    setSelectedTarget(null)
    setActionDetails({})
  }

  return (
    <div className="cyber-card">
      <h3 className="text-xl font-bold text-neon-pink mb-4">🎯 Competitive Actions</h3>

      {/* Action Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setSelectedAction('hire')}
          className={`p-4 rounded-lg border transition-all ${
            selectedAction === 'hire'
              ? 'bg-neon-green/20 border-neon-green'
              : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue'
          }`}
        >
          <div className="text-2xl mb-2">👨‍💼</div>
          <div className="font-semibold text-neon-green">Hire Employee</div>
          <div className="text-xs text-gray-400 mt-1">Grow your team</div>
        </button>

        <button
          onClick={() => setSelectedAction('marketing')}
          className={`p-4 rounded-lg border transition-all ${
            selectedAction === 'marketing'
              ? 'bg-neon-blue/20 border-neon-blue'
              : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue'
          }`}
        >
          <div className="text-2xl mb-2">📣</div>
          <div className="font-semibold text-neon-blue">Marketing Blitz</div>
          <div className="text-xs text-gray-400 mt-1">Acquire users fast</div>
        </button>

        {allowPoaching && (
          <button
            onClick={() => setSelectedAction('poach')}
            className={`p-4 rounded-lg border transition-all ${
              selectedAction === 'poach'
                ? 'bg-neon-pink/20 border-neon-pink'
                : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue'
            }`}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-neon-pink">Poach Employee</div>
            <div className="text-xs text-gray-400 mt-1">Steal from rivals</div>
          </button>
        )}

        {allowSabotage && (
          <button
            onClick={() => setSelectedAction('sabotage')}
            className={`p-4 rounded-lg border transition-all ${
              selectedAction === 'sabotage'
                ? 'bg-red-500/20 border-red-500'
                : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue'
            }`}
          >
            <div className="text-2xl mb-2">💣</div>
            <div className="font-semibold text-red-500">Sabotage</div>
            <div className="text-xs text-gray-400 mt-1">Disrupt competitor</div>
          </button>
        )}
      </div>

      {/* Target Selection for poach/sabotage */}
      {(selectedAction === 'poach' || selectedAction === 'sabotage') && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Select Target:</p>
          <div className="space-y-2">
            {opponents.map((opp) => (
              <button
                key={opp.id}
                onClick={() => setSelectedTarget(opp.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedTarget === opp.id
                    ? 'bg-neon-blue/20 border-neon-blue'
                    : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{opp.username}</div>
                    <div className="text-xs text-gray-400">{opp.startupName}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {opp.metrics.team_size} employees • {opp.metrics.user_count.toLocaleString()} users
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Details */}
      {selectedAction === 'poach' && selectedTarget && (
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Offer Amount ($)</label>
          <input
            type="number"
            value={actionDetails.offer || 50000}
            onChange={(e) => setActionDetails({ ...actionDetails, offer: parseInt(e.target.value) })}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
            min="10000"
            step="10000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Higher offers increase success chance (base 30%)
          </p>
        </div>
      )}

      {selectedAction === 'sabotage' && selectedTarget && (
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Sabotage Type</label>
          <select
            value={actionDetails.sabotageType || 'ddos'}
            onChange={(e) => setActionDetails({ ...actionDetails, sabotageType: e.target.value })}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
          >
            <option value="ddos">DDoS Attack (-20 satisfaction)</option>
            <option value="poach_clients">Poach Clients (-10% users)</option>
            <option value="bad_press">Bad Press (-5% growth, -10 morale)</option>
          </select>
        </div>
      )}

      {selectedAction === 'marketing' && (
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Budget ($)</label>
          <input
            type="number"
            value={actionDetails.budget || 10000}
            onChange={(e) => setActionDetails({ ...actionDetails, budget: parseInt(e.target.value) })}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
            min="1000"
            step="1000"
          />
        </div>
      )}

      {selectedAction === 'hire' && (
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Role</label>
          <select
            value={actionDetails.role || 'engineer'}
            onChange={(e) => setActionDetails({ ...actionDetails, role: e.target.value, salary: e.target.value === 'engineer' ? 12000 : 8000 })}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
          >
            <option value="engineer">Engineer ($12k/mo)</option>
            <option value="sales">Sales ($8k/mo)</option>
            <option value="marketer">Marketer ($9k/mo)</option>
          </select>
        </div>
      )}

      {/* Execute Button */}
      {selectedAction && (
        <Button
          onClick={handleExecute}
          disabled={
            (selectedAction === 'poach' || selectedAction === 'sabotage') && !selectedTarget
          }
          className="w-full"
        >
          Execute {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
        </Button>
      )}
    </div>
  )
}
