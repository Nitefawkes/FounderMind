'use client'

import { useState } from 'react'
import type { Challenge, ChallengeProgress } from '@/lib/types/challenge.types'
import { motion } from 'framer-motion'

interface DailyChallengeCardProps {
  challenge: Challenge
  progress?: ChallengeProgress
  onStart?: (challengeId: string) => void
  onClaim?: (challengeId: string) => void
  isBonus?: boolean
}

const DIFFICULTY_STYLES = {
  easy: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    text: 'text-green-500',
    glow: 'shadow-green-500/20'
  },
  medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    text: 'text-yellow-500',
    glow: 'shadow-yellow-500/20'
  },
  hard: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
    text: 'text-orange-500',
    glow: 'shadow-orange-500/20'
  },
  expert: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    text: 'text-red-500',
    glow: 'shadow-red-500/20'
  }
}

export default function DailyChallengeCard({
  challenge,
  progress,
  onStart,
  onClaim,
  isBonus = false
}: DailyChallengeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const difficultyStyle = DIFFICULTY_STYLES[challenge.difficulty]

  const isCompleted = progress?.status === 'completed'
  const isInProgress = progress?.status === 'in-progress'
  const isExpired = progress?.status === 'expired' || new Date() > challenge.expiresAt

  const progressPercent = progress?.progress || 0

  // Calculate time remaining
  const timeRemaining = () => {
    const now = new Date()
    const diff = challenge.expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ${hours % 24}h`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg border-2 p-4 transition-all ${
        isBonus
          ? 'bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 border-neon-pink shadow-lg shadow-neon-pink/30'
          : `${difficultyStyle.bg} ${difficultyStyle.border} shadow-lg ${difficultyStyle.glow}`
      } ${isCompleted ? 'opacity-75' : ''} ${isExpired ? 'grayscale opacity-50' : ''}`}
    >
      {/* Bonus Badge */}
      {isBonus && (
        <div className="absolute -top-3 -right-3 bg-neon-pink border-2 border-white rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
          BONUS 🔥
        </div>
      )}

      {/* Completed Badge */}
      {isCompleted && (
        <div className="absolute -top-3 -left-3 bg-neon-green border-2 border-white rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
          ✓ DONE
        </div>
      )}

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{challenge.icon}</div>
            <div>
              <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded ${difficultyStyle.bg} ${difficultyStyle.text} border ${difficultyStyle.border}`}>
                  {challenge.difficulty.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  ⏱️ {challenge.estimatedTime} min
                </span>
              </div>
            </div>
          </div>

          {!isExpired && !isCompleted && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Expires in</div>
              <div className="text-sm font-bold text-neon-pink">{timeRemaining()}</div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300">{challenge.description}</p>

        {/* Progress Bar */}
        {isInProgress && !isCompleted && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs text-neon-green">{progressPercent}%</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="bg-neon-green h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-gray-400">XP</div>
              <div className="text-sm font-bold text-neon-green">
                +{challenge.rewards.xp}
                {challenge.rewards.bonusMultiplier && challenge.rewards.bonusMultiplier > 1 && (
                  <span className="text-xs text-neon-pink ml-1">
                    (x{challenge.rewards.bonusMultiplier.toFixed(1)})
                  </span>
                )}
              </div>
            </div>
            {challenge.rewards.coins && (
              <div className="text-center">
                <div className="text-xs text-gray-400">Coins</div>
                <div className="text-sm font-bold text-neon-blue">
                  +{challenge.rewards.coins}
                </div>
              </div>
            )}
            {challenge.rewards.achievements && challenge.rewards.achievements.length > 0 && (
              <div className="text-center">
                <div className="text-xs text-gray-400">Achievement</div>
                <div className="text-sm">🏆</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            {isExpired ? (
              <div className="text-xs text-gray-500 font-bold">EXPIRED</div>
            ) : isCompleted ? (
              <button
                onClick={() => onClaim?.(challenge.id)}
                className="px-4 py-2 bg-neon-green/20 border border-neon-green rounded text-neon-green hover:bg-neon-green/30 transition-all font-bold text-sm"
              >
                Claim Rewards
              </button>
            ) : isInProgress ? (
              <div className="text-xs text-neon-blue font-bold">IN PROGRESS</div>
            ) : (
              <button
                onClick={() => onStart?.(challenge.id)}
                className="px-4 py-2 bg-neon-pink/20 border border-neon-pink rounded text-neon-pink hover:bg-neon-pink/30 transition-all font-bold text-sm"
              >
                Start
              </button>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {challenge.skills && challenge.skills.length > 0 && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-400 hover:text-white transition-all"
            >
              {isExpanded ? '▼' : '▶'} Details
            </button>

            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-2 pt-2 border-t border-gray-700"
              >
                <div className="text-xs text-gray-400 mb-1">Skills Trained:</div>
                <div className="flex flex-wrap gap-1">
                  {challenge.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded text-xs text-neon-blue"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
