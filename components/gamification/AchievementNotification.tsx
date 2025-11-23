'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Achievement } from '@/lib/gamification/AchievementSystem'

interface AchievementNotificationProps {
  achievement: Achievement
  levelUp?: number
  onClose: () => void
}

export function AchievementNotification({
  achievement,
  levelUp,
  onClose,
}: AchievementNotificationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300) // Wait for animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const rarityColors = {
    common: 'border-gray-400 bg-gray-400/10',
    rare: 'border-neon-blue bg-neon-blue/10',
    epic: 'border-neon-pink bg-neon-pink/10',
    legendary: 'border-yellow-400 bg-yellow-400/10',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-20 right-4 z-50 max-w-sm"
        >
          <div
            className={`p-6 rounded-lg border-2 ${
              rarityColors[achievement.rarity]
            } backdrop-blur-sm shadow-2xl`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-neon-green">
                    Achievement Unlocked!
                  </span>
                  <span className="text-xs text-gray-400">+{achievement.xpReward} XP</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-300">{achievement.description}</p>

                {levelUp && (
                  <div className="mt-3 p-2 bg-neon-green/20 border border-neon-green rounded">
                    <p className="text-sm font-bold text-neon-green">
                      🎉 Level Up! You&apos;re now Level {levelUp}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
