'use client'

import { useState } from 'react'
import type { Scenario, ScenarioCategory, DifficultyLevel } from '@/lib/types/scenario.types'

interface ScenarioBrowserProps {
  scenarios: Scenario[]
  completedScenarioIds?: string[]
  onSelectScenario: (scenario: Scenario) => void
}

const DIFFICULTY_COLORS = {
  beginner: 'text-green-400 border-green-400',
  intermediate: 'text-yellow-400 border-yellow-400',
  advanced: 'text-orange-400 border-orange-400',
  expert: 'text-red-400 border-red-400'
}

const CATEGORY_ICONS = {
  'famous-startup': '⭐',
  'crisis-management': '🔥',
  'growth-strategy': '📈',
  'fundraising': '💰',
  'product-launch': '🚀',
  'team-building': '👥',
  'pivot-decision': '🔄'
}

export default function ScenarioBrowser({
  scenarios,
  completedScenarioIds = [],
  onSelectScenario
}: ScenarioBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all')
  const [showCompleted, setShowCompleted] = useState(true)

  // Get unique categories and difficulties
  const categories = Array.from(new Set(scenarios.map(s => s.category)))
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert']

  // Filter scenarios
  const filteredScenarios = scenarios.filter(scenario => {
    const categoryMatch = selectedCategory === 'all' || scenario.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty
    const completedMatch = showCompleted || !completedScenarioIds.includes(scenario.id)

    return categoryMatch && difficultyMatch && completedMatch
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-neon-green mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ScenarioCategory | 'all')}
              className="w-full bg-black/50 border border-neon-green/30 rounded px-3 py-2 text-white focus:border-neon-green outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat as ScenarioCategory]} {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
              className="w-full bg-black/50 border border-neon-green/30 rounded px-3 py-2 text-white focus:border-neon-green outline-none"
            >
              <option value="all">All Levels</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Show Completed */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Display</label>
            <label className="flex items-center space-x-2 bg-black/50 border border-neon-green/30 rounded px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="form-checkbox text-neon-green"
              />
              <span className="text-white">Show Completed</span>
            </label>
          </div>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map(scenario => {
          const isCompleted = completedScenarioIds.includes(scenario.id)

          return (
            <div
              key={scenario.id}
              className={`bg-cyber-dark border rounded-lg p-6 cursor-pointer transition-all hover:scale-105 ${
                isCompleted
                  ? 'border-neon-green/50 opacity-80'
                  : 'border-neon-pink/30 hover:border-neon-pink'
              }`}
              onClick={() => onSelectScenario(scenario)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">
                  {CATEGORY_ICONS[scenario.category]}
                </div>
                {isCompleted && (
                  <div className="bg-neon-green/20 border border-neon-green rounded px-2 py-1">
                    <span className="text-xs text-neon-green font-bold">✓ COMPLETED</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {scenario.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {scenario.description}
              </p>

              {/* Real World Inspiration */}
              {scenario.realWorldInspiration && (
                <div className="bg-neon-blue/10 border border-neon-blue/30 rounded p-2 mb-4">
                  <p className="text-xs text-neon-blue">
                    🏢 Based on: <span className="font-bold">{scenario.realWorldInspiration.company}</span>
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded border ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
                  {scenario.difficulty.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-1 rounded border border-gray-500 text-gray-400">
                  ⏱️ {scenario.estimatedTime} min
                </span>
                <span className="text-xs px-2 py-1 rounded border border-gray-500 text-gray-400">
                  🎯 {scenario.decisions.length} decisions
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {scenario.skills.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 rounded bg-neon-green/10 text-neon-green border border-neon-green/30"
                  >
                    {skill}
                  </span>
                ))}
                {scenario.skills.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                    +{scenario.skills.length - 3}
                  </span>
                )}
              </div>

              {/* XP Reward */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Rewards:</span>
                  <span className="text-sm font-bold text-neon-pink">
                    +{scenario.rewards.xp} XP
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No scenarios match your filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSelectedDifficulty('all')
              setShowCompleted(true)
            }}
            className="mt-4 px-4 py-2 bg-neon-green/20 border border-neon-green rounded text-neon-green hover:bg-neon-green/30"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
