'use client'

import { SkillTreeSystem } from '@/lib/gamification/SkillTreeSystem'
import type { SkillNode, PlayerSkills } from '@/lib/types/scenario.types'
import { useState } from 'react'

interface SkillTreeDisplayProps {
  playerSkills: PlayerSkills
}

export default function SkillTreeDisplay({ playerSkills }: SkillTreeDisplayProps) {
  const [skillSystem] = useState(() => new SkillTreeSystem(playerSkills))
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)

  const availableSkills = skillSystem.getAvailableSkills()
  const lockedSkills = skillSystem.getLockedSkills()

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green rounded-lg p-6">
        <h2 className="text-2xl font-bold text-neon-green mb-2">Your Skill Tree</h2>
        <p className="text-gray-300">
          Total Skill Points: <span className="text-neon-pink font-bold">{playerSkills.totalSkillPoints}</span>
        </p>
      </div>

      {/* Top Skills */}
      <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-neon-blue mb-4">🏆 Your Strongest Skills</h3>
        <div className="space-y-3">
          {skillSystem.getTopSkills(3).map((skill, index) => {
            const skillNode = skillSystem.getSkillNode(skill.skill)
            return (
              <div
                key={skill.skill}
                className="flex items-center space-x-4 p-3 bg-black/30 border border-neon-green/30 rounded"
              >
                <div className="text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{skillNode?.icon}</span>
                    <span className="font-bold text-white">{skillNode?.name}</span>
                    <span className="text-sm text-neon-green">Level {skill.level}</span>
                  </div>
                  <div className="text-sm text-gray-400">{skill.points} points</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Available Skills */}
      <div className="bg-cyber-dark border border-neon-pink/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-neon-pink mb-4">Available Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSkills.map(skill => {
            const progress = skillSystem.getSkillProgress(skill.skill)
            if (!progress) return null

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className="p-4 bg-black/30 border border-neon-green/30 rounded cursor-pointer hover:border-neon-green transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{skill.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{skill.name}</h4>
                    <p className="text-sm text-neon-green">Level {progress.level}/{skill.maxLevel}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="w-full bg-black/50 rounded-full h-2">
                    <div
                      className="bg-neon-green h-2 rounded-full transition-all"
                      style={{ width: `${progress.percentToNext}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {progress.isMaxLevel ? 'MAX LEVEL' : `${progress.pointsToNextLevel} pts to next level`}
                  </p>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2">{skill.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Locked Skills */}
      {lockedSkills.length > 0 && (
        <div className="bg-cyber-dark border border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-400 mb-4">🔒 Locked Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedSkills.map(skill => (
              <div
                key={skill.id}
                className="p-4 bg-black/30 border border-gray-600 rounded opacity-60"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl grayscale">{skill.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-400">{skill.name}</h4>
                    <p className="text-sm text-gray-500">LOCKED</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-2">
                  Requires: {skill.missingPrereqs.map(prereq => {
                    const prereqSkill = skillSystem.getSkillNode(prereq as any)
                    return prereqSkill?.name
                  }).join(', ')}
                </p>

                <p className="text-xs text-gray-500 line-clamp-2">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSkill(null)}
        >
          <div
            className="bg-cyber-dark border border-neon-green rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-5xl">{selectedSkill.icon}</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-neon-green">{selectedSkill.name}</h3>
                <p className="text-gray-400">Max Level: {selectedSkill.maxLevel}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{selectedSkill.description}</p>

            {/* Unlocks */}
            <div className="space-y-4">
              {selectedSkill.unlocks.scenarios && selectedSkill.unlocks.scenarios.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-neon-blue mb-2">Unlocks Scenarios:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.unlocks.scenarios.map(scenario => (
                      <span
                        key={scenario}
                        className="px-2 py-1 bg-neon-blue/20 border border-neon-blue/30 rounded text-xs text-neon-blue"
                      >
                        {scenario}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSkill.unlocks.features && selectedSkill.unlocks.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-neon-pink mb-2">Unlocks Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.unlocks.features.map(feature => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-neon-pink/20 border border-neon-pink/30 rounded text-xs text-neon-pink"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSkill.unlocks.advisorInsights && selectedSkill.unlocks.advisorInsights.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-neon-green mb-2">Unlocks Advisor Insights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.unlocks.advisorInsights.map(insight => (
                      <span
                        key={insight}
                        className="px-2 py-1 bg-neon-green/20 border border-neon-green/30 rounded text-xs text-neon-green"
                      >
                        {insight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="mt-6 w-full px-4 py-2 bg-neon-green/20 border border-neon-green rounded text-neon-green hover:bg-neon-green/30 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
