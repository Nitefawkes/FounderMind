'use client'

import { useState } from 'react'
import { Leaderboard } from './Leaderboard'
import { CompetitionFeed } from './CompetitionFeed'
import { MetricCard } from '@/components/ui/MetricCard'

interface SpectatorModeProps {
  competitionId: string
  leaderboard: any[]
  events: any[]
  currentDay: number
  totalDays: number
}

export function SpectatorMode({
  competitionId,
  leaderboard,
  events,
  currentDay,
  totalDays,
}: SpectatorModeProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  const player = selectedPlayer
    ? leaderboard.find((p) => p.playerId === selectedPlayer)
    : leaderboard[0]

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">👁️</span>
              <div>
                <h1 className="text-3xl font-bold text-neon-blue">Spectator Mode</h1>
                <p className="text-gray-400">Competition ID: {competitionId}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Day"
          value={`${currentDay}/${totalDays}`}
          icon="📅"
          color="blue"
        />
        <MetricCard
          label="Active Players"
          value={leaderboard.filter((p) => !p.eliminated).length}
          icon="👥"
          color="green"
        />
        <MetricCard
          label="Total Events"
          value={events.length}
          icon="⚡"
          color="pink"
        />
        <MetricCard
          label="Market Cap"
          value={`$${(leaderboard.reduce((sum, p) => sum + (p.metrics?.valuation || 0), 0) / 1000000).toFixed(1)}M`}
          icon="💰"
          color="green"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <Leaderboard entries={leaderboard} />

          {/* Player Selector */}
          <div className="cyber-card mt-6">
            <h3 className="text-lg font-bold text-neon-green mb-3">Focus on Player</h3>
            <div className="space-y-2">
              {leaderboard.map((p) => (
                <button
                  key={p.playerId}
                  onClick={() => setSelectedPlayer(p.playerId)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedPlayer === p.playerId
                      ? 'bg-neon-blue/20 border-neon-blue'
                      : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue/50'
                  }`}
                >
                  <div className="font-semibold text-white">{p.username}</div>
                  <div className="text-xs text-gray-400">{p.startupName}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Player Detail View */}
        <div className="lg:col-span-1">
          {player && (
            <div className="cyber-card">
              <h3 className="text-xl font-bold text-neon-pink mb-4">
                {player.username}&apos;s Dashboard
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Startup Name</p>
                  <p className="text-lg font-bold text-white">{player.startupName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">MRR</p>
                    <p className="text-xl font-bold text-neon-green">
                      ${(player.metrics.mrr / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Users</p>
                    <p className="text-xl font-bold text-neon-blue">
                      {player.metrics.user_count.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Growth Rate</p>
                    <p className="text-xl font-bold text-neon-green">
                      {player.metrics.user_growth_rate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Runway</p>
                    <p className="text-xl font-bold text-white">
                      {player.metrics.runway} mo
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Team</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-lg font-bold text-white">{player.metrics.team_size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Morale</p>
                      <p className="text-lg font-bold text-white">{player.metrics.team_morale}/100</p>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-cyber-dark rounded-full h-2">
                        <div
                          className="bg-neon-green h-2 rounded-full"
                          style={{ width: `${player.metrics.team_morale}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Product Quality</p>
                  <div className="w-full bg-cyber-dark rounded-full h-3">
                    <div
                      className="bg-neon-blue h-3 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${player.metrics.product_quality}%` }}
                    >
                      <span className="text-xs font-bold">
                        {player.metrics.product_quality.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Customer Satisfaction</p>
                  <div className="w-full bg-cyber-dark rounded-full h-3">
                    <div
                      className="bg-neon-pink h-3 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${player.metrics.customer_satisfaction}%` }}
                    >
                      <span className="text-xs font-bold">
                        {player.metrics.customer_satisfaction}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Feed */}
        <div className="lg:col-span-1">
          <CompetitionFeed events={events} maxEvents={30} />
        </div>
      </div>

      {/* Commentary */}
      <div className="cyber-card mt-6">
        <h3 className="text-lg font-bold text-neon-green mb-3">💬 Live Commentary</h3>
        <div className="space-y-3">
          <div className="p-3 bg-cyber-dark rounded">
            <p className="text-sm text-gray-300">
              <strong className="text-neon-blue">{leaderboard[0]?.username}</strong> is dominating with strong user growth!
              Their {leaderboard[0]?.metrics.user_growth_rate.toFixed(1)}% growth rate is putting pressure on competitors.
            </p>
          </div>
          {leaderboard[1] && (
            <div className="p-3 bg-cyber-dark rounded">
              <p className="text-sm text-gray-300">
                <strong className="text-neon-pink">{leaderboard[1]?.username}</strong> is catching up fast with superior product quality
                ({leaderboard[1]?.metrics.product_quality.toFixed(0)}/100). Will it be enough?
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
