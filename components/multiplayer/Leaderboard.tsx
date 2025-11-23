'use client'

import { MetricCard } from '@/components/ui/MetricCard'
import type { StartupMetrics } from '@/lib/types/database.types'

interface LeaderboardEntry {
  rank: number
  playerId: string
  username: string
  startupName: string
  score: number
  metrics: StartupMetrics
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400' // Gold
      case 2:
        return 'text-gray-300' // Silver
      case 3:
        return 'text-orange-400' // Bronze
      default:
        return 'text-gray-500'
    }
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  return (
    <div className="cyber-card">
      <h2 className="text-2xl font-bold text-neon-green mb-6">🏆 Leaderboard</h2>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isCurrentUser = entry.playerId === currentUserId
          return (
            <div
              key={entry.playerId}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isCurrentUser
                  ? 'bg-neon-green/10 border-neon-green shadow-[0_0_20px_rgba(0,255,178,0.2)]'
                  : 'bg-cyber-dark border-neon-blue/30 hover:border-neon-blue/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`text-3xl font-bold ${getRankColor(entry.rank)} min-w-[60px] text-center`}>
                  {getRankEmoji(entry.rank)}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neon-green">
                      {entry.username}
                      {isCurrentUser && <span className="text-neon-pink ml-2">(You)</span>}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">{entry.startupName}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 min-w-[300px]">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="text-lg font-bold text-neon-blue">
                      {entry.score.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Users</p>
                    <p className="text-lg font-bold text-white">
                      {entry.metrics.user_count.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">MRR</p>
                    <p className="text-lg font-bold text-neon-green">
                      ${(entry.metrics.mrr / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded metrics for current user */}
              {isCurrentUser && (
                <div className="mt-4 pt-4 border-t border-neon-green/30">
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Runway</p>
                      <p className="text-sm font-semibold text-white">{entry.metrics.runway}mo</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Team</p>
                      <p className="text-sm font-semibold text-white">{entry.metrics.team_size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Morale</p>
                      <p className="text-sm font-semibold text-white">{entry.metrics.team_morale}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quality</p>
                      <p className="text-sm font-semibold text-white">
                        {entry.metrics.product_quality.toFixed(0)}/100
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-2">No players yet</p>
            <p className="text-sm">Be the first to join the competition!</p>
          </div>
        )}
      </div>
    </div>
  )
}
