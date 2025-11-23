'use client'

import type { PlayerProgress } from '@/lib/gamification/AchievementSystem'

interface ProgressTrackerProps {
  progress: PlayerProgress
  nextLevelXP: number
}

export function ProgressTracker({ progress, nextLevelXP }: ProgressTrackerProps) {
  const currentLevelXP = (progress.level - 1) * 1000
  const levelXP = progress.totalXP - currentLevelXP
  const levelPercent = (levelXP / 1000) * 100

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-neon-green">Level {progress.level}</h3>
          <p className="text-sm text-gray-400">Founder Progress</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-neon-blue">{progress.totalXP} XP</p>
          <p className="text-xs text-gray-400">{nextLevelXP} to next level</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-cyber-dark rounded-full h-4 relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-neon-green to-neon-blue h-4 rounded-full transition-all duration-500"
            style={{ width: `${levelPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse-glow" />
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Level {progress.level}</span>
          <span>{Math.round(levelPercent)}%</span>
          <span>Level {progress.level + 1}</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-cyber-dark rounded text-center">
          <p className="text-2xl font-bold text-neon-green">
            {progress.unlockedAchievements.length}
          </p>
          <p className="text-xs text-gray-400">Achievements</p>
        </div>
        <div className="p-3 bg-cyber-dark rounded text-center">
          <p className="text-2xl font-bold text-neon-blue">{progress.level}</p>
          <p className="text-xs text-gray-400">Current Level</p>
        </div>
        <div className="p-3 bg-cyber-dark rounded text-center">
          <p className="text-2xl font-bold text-neon-pink">
            {Math.round((progress.unlockedAchievements.length / 25) * 100)}%
          </p>
          <p className="text-xs text-gray-400">Completion</p>
        </div>
      </div>

      {/* Level Perks */}
      <div className="mt-4 p-3 bg-neon-green/10 border border-neon-green/30 rounded">
        <p className="text-xs text-gray-400 mb-2">Level {progress.level} Perks:</p>
        <ul className="text-sm text-neon-green space-y-1">
          {progress.level >= 1 && <li>✓ Access to all advisors</li>}
          {progress.level >= 3 && <li>✓ Multiplayer unlocked</li>}
          {progress.level >= 5 && <li>✓ Advanced scenarios</li>}
          {progress.level >= 10 && <li>✓ Tournament mode</li>}
        </ul>
      </div>
    </div>
  )
}
