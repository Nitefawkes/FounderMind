'use client'

import { useState, useEffect } from 'react'
import { AchievementGrid } from '@/components/gamification/AchievementGrid'
import { ProgressTracker } from '@/components/dashboard/ProgressTracker'
import { DecisionHistory } from '@/components/analytics/DecisionHistory'
import { AchievementSystem, ACHIEVEMENTS } from '@/lib/gamification/AchievementSystem'
import type { DecisionType } from '@/lib/types/database.types'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history'>('overview')
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  // Mock data - would come from database/context
  const achievementSystem = new AchievementSystem('user_123', {
    level: 7,
    totalXP: 6500,
    unlockedAchievements: [
      'first_startup',
      'first_100_users',
      'first_1k_users',
      'first_competition',
      'first_win',
      'first_advisor_chat',
      'ask_all_advisors',
      'survive_year',
    ],
    achievementProgress: {
      first_10k_mrr: 8500,
      poach_master: 6,
      board_meeting_10: 4,
    },
  })

  const progress = achievementSystem.getProgress()
  const nextLevelXP = achievementSystem.getNextLevelXP()
  const unlocked = achievementSystem.getUnlockedAchievements()
  const available = achievementSystem.getAvailableAchievements()

  const filteredAchievements =
    achievementFilter === 'unlocked'
      ? unlocked
      : achievementFilter === 'locked'
        ? available
        : [...unlocked, ...available]

  // Mock decision history
  const decisionHistory = [
    {
      id: '1',
      type: 'hire' as DecisionType,
      choice: 'Hired Senior Engineer',
      outcome: { team_size: 1, burn_rate: 12000 },
      impact: 25,
      timestamp: Date.now() - 86400000,
      success: true,
    },
    {
      id: '2',
      type: 'marketing_campaign' as DecisionType,
      choice: 'Viral TikTok Campaign',
      outcome: { user_count: 2500 },
      impact: 50,
      timestamp: Date.now() - 172800000,
      success: true,
    },
    {
      id: '3',
      type: 'pivot' as DecisionType,
      choice: 'Pivoted to B2B from B2C',
      outcome: { user_count: -500, mrr: 15000 },
      impact: -10,
      timestamp: Date.now() - 259200000,
      success: false,
    },
  ]

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-neon-blue/20 border-2 border-neon-blue rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neon-green">Founder Profile</h1>
            <p className="text-gray-400">Level {progress.level} • {progress.totalXP} XP</p>
          </div>
          <div className="ml-auto">
            <button className="cyber-button">Edit Profile</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'overview'
              ? 'bg-neon-green text-cyber-darker font-bold'
              : 'bg-cyber-dark text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'achievements'
              ? 'bg-neon-blue text-cyber-darker font-bold'
              : 'bg-cyber-dark text-gray-400 hover:text-white'
          }`}
        >
          Achievements ({unlocked.length}/{ACHIEVEMENTS.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-neon-pink text-cyber-darker font-bold'
              : 'bg-cyber-dark text-gray-400 hover:text-white'
          }`}
        >
          Decision History
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ProgressTracker progress={progress} nextLevelXP={nextLevelXP} />

          <div className="cyber-card">
            <h3 className="text-xl font-bold text-neon-blue mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="p-3 bg-cyber-dark rounded-lg flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Won Competition</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
                <span className="text-xs text-neon-green">+1000 XP</span>
              </div>
              <div className="p-3 bg-cyber-dark rounded-lg flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Consulted CFO</p>
                  <p className="text-xs text-gray-400">5 hours ago</p>
                </div>
              </div>
              <div className="p-3 bg-cyber-dark rounded-lg flex items-center gap-3">
                <span className="text-2xl">👨‍💼</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Hired Engineer</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
                <span className="text-xs text-neon-blue">+25 Impact</span>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-xl font-bold text-neon-pink mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-cyber-dark rounded text-center">
                <p className="text-3xl font-bold text-neon-green">12</p>
                <p className="text-xs text-gray-400">Startups Created</p>
              </div>
              <div className="p-3 bg-cyber-dark rounded text-center">
                <p className="text-3xl font-bold text-neon-blue">8</p>
                <p className="text-xs text-gray-400">Competitions Won</p>
              </div>
              <div className="p-3 bg-cyber-dark rounded text-center">
                <p className="text-3xl font-bold text-neon-pink">47</p>
                <p className="text-xs text-gray-400">Decisions Made</p>
              </div>
              <div className="p-3 bg-cyber-dark rounded text-center">
                <p className="text-3xl font-bold text-yellow-400">23</p>
                <p className="text-xs text-gray-400">Advisor Sessions</p>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-xl font-bold text-neon-green mb-4">Badges</h3>
            <div className="grid grid-cols-4 gap-3">
              {unlocked.slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-3 bg-cyber-dark rounded-lg text-center hover:scale-110 transition-transform cursor-pointer"
                  title={achievement.title}
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setAchievementFilter('all')}
                className={`px-4 py-2 rounded text-sm ${
                  achievementFilter === 'all'
                    ? 'bg-neon-green text-cyber-darker'
                    : 'bg-cyber-dark text-gray-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAchievementFilter('unlocked')}
                className={`px-4 py-2 rounded text-sm ${
                  achievementFilter === 'unlocked'
                    ? 'bg-neon-blue text-cyber-darker'
                    : 'bg-cyber-dark text-gray-400'
                }`}
              >
                Unlocked ({unlocked.length})
              </button>
              <button
                onClick={() => setAchievementFilter('locked')}
                className={`px-4 py-2 rounded text-sm ${
                  achievementFilter === 'locked'
                    ? 'bg-neon-pink text-cyber-darker'
                    : 'bg-cyber-dark text-gray-400'
                }`}
              >
                Locked ({available.length})
              </button>
            </div>

            <div className="text-sm text-gray-400">
              {Math.round(achievementSystem.getCompletionPercentage())}% Complete
            </div>
          </div>

          <AchievementGrid achievements={filteredAchievements} showLocked={true} />
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && <DecisionHistory decisions={decisionHistory} />}
    </div>
  )
}
