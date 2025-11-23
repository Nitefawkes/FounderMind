'use client'

import type { Achievement } from '@/lib/gamification/AchievementSystem'

interface AchievementGridProps {
  achievements: Achievement[]
  showLocked?: boolean
}

export function AchievementGrid({ achievements, showLocked = true }: AchievementGridProps) {
  const rarityColors = {
    common: 'border-gray-400',
    rare: 'border-neon-blue',
    epic: 'border-neon-pink',
    legendary: 'border-yellow-400',
  }

  const rarityGradients = {
    common: 'from-gray-400/20 to-transparent',
    rare: 'from-neon-blue/20 to-transparent',
    epic: 'from-neon-pink/20 to-transparent',
    legendary: 'from-yellow-400/20 to-transparent',
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {achievements.map((achievement) => {
        const isLocked = !achievement.unlockedAt
        const progress = achievement.progress || 0
        const progressPercent = Math.min((progress / achievement.requirement) * 100, 100)

        return (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border ${
              rarityColors[achievement.rarity]
            } bg-gradient-to-br ${
              rarityGradients[achievement.rarity]
            } transition-all duration-300 ${
              isLocked ? 'opacity-50 grayscale' : 'hover:scale-105'
            }`}
          >
            <div className="text-center">
              <div className={`text-4xl mb-2 ${isLocked ? 'filter blur-sm' : ''}`}>
                {achievement.icon}
              </div>
              <h4 className="font-bold text-white mb-1 text-sm">{achievement.title}</h4>
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                {achievement.description}
              </p>

              {/* Progress bar for locked achievements */}
              {isLocked && showLocked && (
                <div className="mt-2">
                  <div className="w-full bg-cyber-dark rounded-full h-1.5 mb-1">
                    <div
                      className="bg-neon-green h-1.5 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {progress}/{achievement.requirement}
                  </p>
                </div>
              )}

              {/* Unlock date */}
              {achievement.unlockedAt && (
                <div className="mt-2 text-xs text-neon-green">
                  ✓ Unlocked • +{achievement.xpReward} XP
                </div>
              )}

              {/* Rarity badge */}
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    rarityColors[achievement.rarity]
                  } bg-cyber-dark uppercase tracking-wider`}
                >
                  {achievement.rarity}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
