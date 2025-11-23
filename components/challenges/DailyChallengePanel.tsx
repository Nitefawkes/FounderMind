'use client'

import { useState, useEffect } from 'react'
import { DailyChallengeEngine } from '@/lib/gamification/DailyChallengeEngine'
import DailyChallengeCard from './DailyChallengeCard'
import type { DailyChallengeSet, PlayerChallengeStats } from '@/lib/types/challenge.types'
import { motion } from 'framer-motion'

export default function DailyChallengePanel() {
  const [challengeSet, setChallengeSet] = useState<DailyChallengeSet | null>(null)
  const [stats, setStats] = useState<PlayerChallengeStats | null>(null)
  const [engine, setEngine] = useState<DailyChallengeEngine | null>(null)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('challengeStats')
    const playerStats: PlayerChallengeStats = savedStats
      ? JSON.parse(savedStats)
      : {
          userId: 'demo-user',
          currentStreak: 0,
          longestStreak: 0,
          totalCompleted: 0,
          completionRate: 0,
          totalXpEarned: 0,
          totalCoinsEarned: 0
        }

    const challengeEngine = new DailyChallengeEngine(playerStats)
    setEngine(challengeEngine)
    setStats(playerStats)

    // Generate today's challenges
    const todaySet = challengeEngine.generateDailyChallenges()
    setChallengeSet(todaySet)

    // Check for expired challenges
    challengeEngine.expireOldChallenges([
      ...todaySet.challenges,
      ...(todaySet.bonusChallenge ? [todaySet.bonusChallenge] : [])
    ])
  }, [])

  const handleStartChallenge = (challengeId: string) => {
    if (!engine) return

    engine.startChallenge(challengeId)
    // In real implementation, this would update UI to show "in progress"
    console.log('Challenge started:', challengeId)
  }

  const handleClaimRewards = (challengeId: string) => {
    if (!engine || !challengeSet) return

    const challenge = [...challengeSet.challenges, challengeSet.bonusChallenge].find(
      c => c?.id === challengeId
    )

    if (!challenge) return

    const result = engine.completeChallenge(challengeId, challenge)

    // Update stats
    const newStats = engine.getStats()
    setStats(newStats)
    localStorage.setItem('challengeStats', JSON.stringify(newStats))

    // Show completion notification
    console.log('Challenge completed!', result)

    // Could trigger achievement notification here
  }

  if (!challengeSet || !stats) {
    return (
      <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-6">
        <div className="text-gray-400">Loading daily challenges...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Streak */}
      <div className="bg-gradient-to-r from-neon-green/20 to-neon-pink/20 border border-neon-green rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neon-green mb-1">
              Daily Challenges
            </h2>
            <p className="text-sm text-gray-400">
              Complete challenges daily to earn XP, coins, and build your streak!
            </p>
          </div>

          {/* Streak Counter */}
          <div className="text-center">
            <div className="text-4xl mb-1">🔥</div>
            <div className="text-3xl font-bold text-neon-pink">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-gray-400">Day Streak</div>
            {stats.longestStreak > 0 && (
              <div className="text-xs text-neon-blue mt-1">
                Best: {stats.longestStreak}
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neon-green/30">
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {stats.totalCompleted}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-neon-green">
              {stats.totalXpEarned.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-neon-blue">
              {stats.totalCoinsEarned.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Coins</div>
          </div>
        </div>

        {/* Streak Milestone Message */}
        {stats.currentStreak >= 7 && challengeSet.bonusChallenge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-neon-pink/20 border border-neon-pink rounded text-center"
          >
            <div className="text-sm font-bold text-neon-pink">
              🎉 7-Day Streak! Bonus Challenge Unlocked! 🎉
            </div>
          </motion.div>
        )}
      </div>

      {/* Today's Challenges */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Today&apos;s Challenges</h3>
        {challengeSet.challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DailyChallengeCard
              challenge={challenge}
              progress={engine?.getProgress(challenge.id)}
              onStart={handleStartChallenge}
              onClaim={handleClaimRewards}
            />
          </motion.div>
        ))}
      </div>

      {/* Bonus Challenge */}
      {challengeSet.bonusChallenge && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-neon-pink">Bonus Challenge</h3>
            <span className="text-xs px-2 py-1 bg-neon-pink/20 border border-neon-pink rounded text-neon-pink">
              7+ DAY STREAK REQUIRED
            </span>
          </div>
          <DailyChallengeCard
            challenge={challengeSet.bonusChallenge}
            progress={engine?.getProgress(challengeSet.bonusChallenge.id)}
            onStart={handleStartChallenge}
            onClaim={handleClaimRewards}
            isBonus
          />
        </div>
      )}

      {/* Tips */}
      <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-4">
        <h4 className="text-sm font-bold text-neon-blue mb-2">💡 Pro Tips</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Complete challenges every day to build your streak</li>
          <li>• Streak bonuses multiply your XP rewards (10% per day)</li>
          <li>• Unlock expert-level bonus challenges with a 7-day streak</li>
          <li>• Challenges expire at midnight - don&apos;t miss out!</li>
        </ul>
      </div>
    </div>
  )
}
