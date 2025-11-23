'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Leaderboard } from '@/components/multiplayer/Leaderboard'
import { CompetitionActions } from '@/components/multiplayer/CompetitionActions'
import { CompetitionFeed } from '@/components/multiplayer/CompetitionFeed'
import { MetricCard } from '@/components/ui/MetricCard'
import type { CompetitionMode } from '@/lib/multiplayer/CompetitionEngine'

export default function CompetePage() {
  const [isInCompetition, setIsInCompetition] = useState(false)
  const [selectedMode, setSelectedMode] = useState<CompetitionMode>('head-to-head')
  const [competitionId, setCompetitionId] = useState<string | null>(null)

  // Mock data for demo
  const [leaderboard, setLeaderboard] = useState([
    {
      rank: 1,
      playerId: 'p1',
      username: 'TechFounder',
      startupName: 'CloudScale AI',
      score: 1250000,
      metrics: {
        burn_rate: 15000,
        runway: 8,
        mrr: 25000,
        user_count: 5420,
        user_growth_rate: 18.5,
        team_size: 12,
        team_morale: 85,
        product_quality: 78,
        market_share: 2.3,
        valuation: 850000,
        customer_satisfaction: 82,
      },
    },
    {
      rank: 2,
      playerId: 'current',
      username: 'You',
      startupName: 'My Startup',
      score: 980000,
      metrics: {
        burn_rate: 12000,
        runway: 10,
        mrr: 18000,
        user_count: 3200,
        user_growth_rate: 15.2,
        team_size: 8,
        team_morale: 78,
        product_quality: 72,
        market_share: 1.8,
        valuation: 620000,
        customer_satisfaction: 75,
      },
      isCurrentUser: true,
    },
    {
      rank: 3,
      playerId: 'p3',
      username: 'GrowthHacker',
      startupName: 'ViralLoop',
      score: 875000,
      metrics: {
        burn_rate: 18000,
        runway: 6,
        mrr: 22000,
        user_count: 8900,
        user_growth_rate: 25.1,
        team_size: 15,
        team_morale: 65,
        product_quality: 65,
        market_share: 3.1,
        valuation: 520000,
        customer_satisfaction: 68,
      },
    },
  ])

  const [events, setEvents] = useState<Array<{
    id: string
    type: string
    message: string
    timestamp: number
    data: any
    playerId?: string
  }>>([
    {
      id: '1',
      type: 'market_event',
      message: 'Competition started! 3 startups competing in B2B SaaS',
      timestamp: Date.now() - 120000,
      data: {},
    },
    {
      id: '2',
      type: 'player_action',
      message: 'TechFounder launched aggressive marketing campaign',
      timestamp: Date.now() - 90000,
      data: {},
      playerId: 'p1',
    },
    {
      id: '3',
      type: 'player_action',
      message: 'GrowthHacker hired 3 new engineers',
      timestamp: Date.now() - 60000,
      data: {},
      playerId: 'p3',
    },
  ])

  const opponents = leaderboard
    .filter((p) => !p.isCurrentUser)
    .map((p) => ({
      id: p.playerId,
      username: p.username,
      startupName: p.startupName,
      metrics: p.metrics,
    }))

  const handleStartCompetition = (mode: CompetitionMode) => {
    setSelectedMode(mode)
    setIsInCompetition(true)
    setCompetitionId(`comp_${Date.now()}`)

    // Add event
    setEvents((prev) => [
      ...prev,
      {
        id: `evt_${Date.now()}`,
        type: 'player_joined',
        message: 'You joined the competition!',
        timestamp: Date.now(),
        data: {},
      },
    ])
  }

  const handleAction = (action: any) => {
    console.log('Executing action:', action)

    // Add to feed
    const actionMessages: Record<string, string> = {
      hire: 'hired a new employee',
      poach: 'attempted to poach an employee',
      marketing: 'launched a marketing campaign',
      sabotage: 'executed a sabotage attack',
    }

    setEvents((prev) => [
      ...prev,
      {
        id: `evt_${Date.now()}`,
        type: 'player_action',
        message: `You ${actionMessages[action.type] || 'took an action'}`,
        timestamp: Date.now(),
        data: action,
        playerId: 'current',
      },
    ])
  }

  if (!isInCompetition) {
    return (
      <div className="min-h-screen bg-cyber-darker p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-neon-pink neon-text">Multiplayer</span>{' '}
              <span className="text-neon-blue neon-text">Arena</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Compete against other founders in real-time. Poach employees, sabotage competitors, and race to the top!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="cyber-card text-center">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-neon-green mb-2">Head-to-Head</h3>
              <p className="text-gray-400 mb-4">1v1 battle for market dominance</p>
              <ul className="text-sm text-gray-500 mb-6 space-y-1">
                <li>• 30 day competition</li>
                <li>• Employee poaching enabled</li>
                <li>• Winner takes all</li>
              </ul>
              <Button onClick={() => handleStartCompetition('head-to-head')} className="w-full">
                Find Match
              </Button>
            </div>

            <div className="cyber-card text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-neon-blue mb-2">Tournament</h3>
              <p className="text-gray-400 mb-4">Multi-player bracket competition</p>
              <ul className="text-sm text-gray-500 mb-6 space-y-1">
                <li>• 90 day tournament</li>
                <li>• 4-16 players</li>
                <li>• Sabotage allowed</li>
              </ul>
              <Button onClick={() => handleStartCompetition('tournament')} variant="secondary" className="w-full">
                Join Tournament
              </Button>
            </div>

            <div className="cyber-card text-center">
              <div className="text-5xl mb-4">🏃</div>
              <h3 className="text-xl font-bold text-neon-pink mb-2">Marathon</h3>
              <p className="text-gray-400 mb-4">Long-term competition mode</p>
              <ul className="text-sm text-gray-500 mb-6 space-y-1">
                <li>• 365 day endurance</li>
                <li>• Realistic pacing</li>
                <li>• Pure strategy</li>
              </ul>
              <Button onClick={() => handleStartCompetition('marathon')} variant="secondary" className="w-full">
                Start Marathon
              </Button>
            </div>
          </div>

          <div className="cyber-card">
            <h2 className="text-2xl font-bold text-neon-green mb-6">🎮 How to Play</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-neon-blue mb-2">Compete</h4>
                <p className="text-gray-400 text-sm">
                  Face off against other founders in the same market. Every decision matters when you&apos;re racing for users and revenue.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neon-blue mb-2">Poach Employees</h4>
                <p className="text-gray-400 text-sm">
                  Make lucrative offers to steal talent from your competitors. Higher offers increase success rate.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neon-blue mb-2">Market Battles</h4>
                <p className="text-gray-400 text-sm">
                  Limited customers mean direct competition. Use marketing, pricing, and product quality to win market share.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neon-blue mb-2">Strategic Sabotage</h4>
                <p className="text-gray-400 text-sm">
                  In tournaments, use DDoS, bad press, or client poaching to disrupt competitors. But it costs money!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neon-green">Live Competition</h1>
            <p className="text-gray-400">
              {selectedMode === 'head-to-head' ? '1v1 Battle' : selectedMode === 'tournament' ? 'Tournament' : 'Marathon'} •{' '}
              Day 15/30
            </p>
          </div>
          <Button variant="danger" onClick={() => setIsInCompetition(false)}>
            Leave Competition
          </Button>
        </div>
      </div>

      {/* Competition Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Your Rank" value="#2" icon="🏅" color="blue" />
        <MetricCard label="Active Players" value="3" icon="👥" color="green" />
        <MetricCard label="Time Left" value="15 days" icon="⏱️" color="pink" />
        <MetricCard label="Your Score" value="980k" icon="⭐" color="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-1">
          <Leaderboard entries={leaderboard} currentUserId="current" />
        </div>

        {/* Middle Column: Actions */}
        <div className="lg:col-span-1 space-y-6">
          <CompetitionActions
            currentPlayerId="current"
            opponents={opponents}
            onAction={handleAction}
            allowPoaching={selectedMode !== 'marathon'}
            allowSabotage={selectedMode === 'tournament'}
          />
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-1">
          <CompetitionFeed events={events} />
        </div>
      </div>
    </div>
  )
}
