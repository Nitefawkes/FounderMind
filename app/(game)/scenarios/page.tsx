'use client'

import { useState, useEffect } from 'react'
import ScenarioBrowser from '@/components/scenarios/ScenarioBrowser'
import ScenarioPlayer from '@/components/scenarios/ScenarioPlayer'
import SkillTreeDisplay from '@/components/scenarios/SkillTreeDisplay'
import type { Scenario, PlayerSkills, SkillTag } from '@/lib/types/scenario.types'

// Import scenario data
import airbnbData from '@/data/scenarios/airbnb-cereal-hustle.json'
import uberData from '@/data/scenarios/uber-first-ride.json'
import stripeData from '@/data/scenarios/stripe-first-transaction.json'

type TabType = 'scenarios' | 'skills' | 'completed'

export default function ScenariosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('scenarios')
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([])
  const [playerSkills, setPlayerSkills] = useState<PlayerSkills>({
    userId: 'demo-user',
    skills: {},
    totalSkillPoints: 0
  })

  // Load scenarios
  const scenarios: Scenario[] = [
    airbnbData as Scenario,
    uberData as Scenario,
    stripeData as Scenario
  ]

  // Load progress from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('completedScenarios')
    const savedSkills = localStorage.getItem('playerSkills')

    if (savedCompleted) {
      setCompletedScenarios(JSON.parse(savedCompleted))
    }

    if (savedSkills) {
      setPlayerSkills(JSON.parse(savedSkills))
    }
  }, [])

  const handleScenarioComplete = (scenarioId: string, score: number, skillsEarned: Array<{ skill: SkillTag; points: number }>) => {
    // Mark as completed
    const newCompleted = [...completedScenarios, scenarioId]
    setCompletedScenarios(newCompleted)
    localStorage.setItem('completedScenarios', JSON.stringify(newCompleted))

    // Update skills
    const updatedSkills = { ...playerSkills }
    skillsEarned.forEach(({ skill, points }) => {
      const current = updatedSkills.skills[skill] || { level: 0, points: 0, pointsToNextLevel: 100 }
      updatedSkills.skills[skill] = {
        ...current,
        points: current.points + points
      }
      updatedSkills.totalSkillPoints += points
    })
    setPlayerSkills(updatedSkills)
    localStorage.setItem('playerSkills', JSON.stringify(updatedSkills))

    // Reset to browser
    setSelectedScenario(null)
    setActiveTab('scenarios')
  }

  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-black to-cyber-dark p-6">
        <div className="max-w-4xl mx-auto">
          <ScenarioPlayer
            scenario={selectedScenario}
            onComplete={(score, skillsEarned) => handleScenarioComplete(selectedScenario.id, score, skillsEarned)}
            onExit={() => setSelectedScenario(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-black to-cyber-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neon-green mb-2">
            📚 Founder Scenarios
          </h1>
          <p className="text-gray-400">
            Learn from famous startups. Make critical decisions. Build your skills.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-neon-green/30">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'scenarios'
                ? 'text-neon-green border-b-2 border-neon-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎯 Scenarios ({scenarios.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'skills'
                ? 'text-neon-green border-b-2 border-neon-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌳 Skill Tree
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'completed'
                ? 'text-neon-green border-b-2 border-neon-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ✅ Completed ({completedScenarios.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'scenarios' && (
          <ScenarioBrowser
            scenarios={scenarios}
            completedScenarioIds={completedScenarios}
            onSelectScenario={setSelectedScenario}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTreeDisplay playerSkills={playerSkills} />
        )}

        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedScenarios.length === 0 ? (
              <div className="text-center py-12 bg-cyber-dark border border-neon-green/30 rounded-lg">
                <p className="text-gray-400 text-lg mb-4">
                  You haven&apos;t completed any scenarios yet.
                </p>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="px-6 py-3 bg-neon-green/20 border border-neon-green rounded text-neon-green hover:bg-neon-green/30 transition-all font-bold"
                >
                  Browse Scenarios
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios
                  .filter(s => completedScenarios.includes(s.id))
                  .map(scenario => (
                    <div
                      key={scenario.id}
                      className="bg-cyber-dark border border-neon-green rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white line-clamp-1">
                          {scenario.title}
                        </h3>
                        <span className="text-2xl">✅</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {scenario.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neon-green">
                          +{scenario.rewards.xp} XP Earned
                        </span>
                        <button
                          onClick={() => setSelectedScenario(scenario)}
                          className="text-sm text-neon-pink hover:text-neon-pink/80"
                        >
                          Replay →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 bg-gradient-to-r from-neon-green/10 to-neon-pink/10 border border-neon-green/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-neon-green mb-1">
                {completedScenarios.length}/{scenarios.length}
              </p>
              <p className="text-sm text-gray-400">Scenarios Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neon-pink mb-1">
                {playerSkills.totalSkillPoints}
              </p>
              <p className="text-sm text-gray-400">Total Skill Points</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neon-blue mb-1">
                {Object.keys(playerSkills.skills).length}
              </p>
              <p className="text-sm text-gray-400">Skills Developed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
