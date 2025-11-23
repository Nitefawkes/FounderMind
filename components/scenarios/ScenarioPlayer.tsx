'use client'

import { useState, useEffect } from 'react'
import { ScenarioEngine } from '@/lib/scenarios/ScenarioEngine'
import type { Scenario, ScenarioDecision, ScenarioMetrics } from '@/lib/types/scenario.types'
import { motion, AnimatePresence } from 'framer-motion'

interface ScenarioPlayerProps {
  scenario: Scenario
  onComplete: (score: number, skillsEarned: any[]) => void
  onExit: () => void
}

export default function ScenarioPlayer({
  scenario,
  onComplete,
  onExit
}: ScenarioPlayerProps) {
  const [engine] = useState(() => new ScenarioEngine(scenario))
  const [currentDecision, setCurrentDecision] = useState<ScenarioDecision | null>(null)
  const [currentMetrics, setCurrentMetrics] = useState<ScenarioMetrics>(scenario.initialState)
  const [showOutcome, setShowOutcome] = useState(false)
  const [lastOutcome, setLastOutcome] = useState<any>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [caseStudy, setCaseStudy] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    engine.start()
    setCurrentDecision(engine.getCurrentDecision())
    setCurrentMetrics(engine.getProgress().currentMetrics)
  }, [engine])

  const handleDecision = async (optionId: string) => {
    setSelectedOption(optionId)

    try {
      const result = await engine.makeDecision(optionId)
      setLastOutcome(result.outcome)
      setCurrentMetrics(engine.getProgress().currentMetrics)
      setShowOutcome(true)

      // Wait before showing next decision or completion
      setTimeout(() => {
        setShowOutcome(false)
        setSelectedOption(null)

        if (result.scenarioComplete) {
          setIsComplete(true)
          setCaseStudy(result.analysis)
          const progress = engine.getProgress()
          onComplete(progress.score || 0, progress.skillsEarned || [])
        } else {
          setCurrentDecision(result.nextDecision)
        }
      }, 4000)
    } catch (error) {
      console.error('Error making decision:', error)
    }
  }

  const formatMetricValue = (key: keyof ScenarioMetrics, value: number): string => {
    if (key === 'cash') return `$${value.toLocaleString()}`
    if (key === 'runway') return `${value} months`
    if (key === 'mrr') return `$${value.toLocaleString()}/mo`
    if (key.includes('Rate') || key.includes('Quality') || key.includes('Morale') ||
        key.includes('Reputation') || key.includes('Confidence') || key.includes('Share')) {
      return `${value}%`
    }
    return value.toLocaleString()
  }

  if (isComplete && caseStudy) {
    return (
      <div className="space-y-6">
        {/* Completion Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-neon-green/20 to-neon-pink/20 border border-neon-green rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-neon-green mb-2">Scenario Complete!</h2>
          <p className="text-xl text-white">
            Final Score: <span className="text-neon-pink font-bold">{caseStudy.overallPerformance.score}/100</span>
          </p>
          <p className="text-2xl text-neon-blue font-bold mt-2">
            Grade: {caseStudy.overallPerformance.grade}
          </p>
        </motion.div>

        {/* Case Study Analysis */}
        <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-neon-blue mb-4">📊 Performance Analysis</h3>
          <p className="text-gray-300 mb-6">{caseStudy.overallPerformance.comparison}</p>

          {/* Decision Breakdown */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white mb-3">Your Decisions:</h4>
            {caseStudy.playerDecisions.map((decision: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded border ${
                  decision.outcome === 'optimal'
                    ? 'bg-neon-green/10 border-neon-green'
                    : decision.outcome === 'alternative'
                    ? 'bg-yellow-500/10 border-yellow-500'
                    : 'bg-red-500/10 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Decision {index + 1}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    decision.outcome === 'optimal'
                      ? 'bg-neon-green/20 text-neon-green'
                      : decision.outcome === 'alternative'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {decision.outcome.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{decision.optionChosen}</p>
                {decision.actualChoice && (
                  <p className="text-xs text-gray-400 mt-2">
                    💡 Real world: {decision.actualChoice}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Learnings */}
        <div className="bg-cyber-dark border border-neon-pink/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-neon-pink mb-4">🎓 Key Learnings</h3>
          <ul className="space-y-2">
            {caseStudy.keyLearnings.map((learning: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-neon-pink mt-1">•</span>
                <span className="text-gray-300">{learning}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onExit}
            className="flex-1 px-6 py-3 bg-neon-green/20 border border-neon-green rounded text-neon-green hover:bg-neon-green/30 transition-all font-bold"
          >
            ← Back to Scenarios
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 bg-neon-pink/20 border border-neon-pink rounded text-neon-pink hover:bg-neon-pink/30 transition-all font-bold"
          >
            🔄 Retry Scenario
          </button>
        </div>
      </div>
    )
  }

  if (showOutcome && lastOutcome) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 border border-neon-blue rounded-lg p-8">
          <h3 className="text-2xl font-bold text-neon-blue mb-4">Outcome</h3>
          <p className="text-lg text-white mb-6">{lastOutcome.immediate.eventDescription}</p>

          {lastOutcome.longTerm && (
            <div className="bg-black/30 border border-neon-pink/30 rounded p-4 mt-4">
              <p className="text-sm text-neon-pink mb-2">
                📅 {lastOutcome.longTerm.delay} days later...
              </p>
              <p className="text-white">{lastOutcome.longTerm.eventDescription}</p>
            </div>
          )}

          {/* Metric Changes */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(lastOutcome.immediate.metricChanges).map(([key, change]) => {
              const value = change as number
              return (
                <div
                  key={key}
                  className={`p-3 rounded border ${
                    value > 0
                      ? 'bg-neon-green/10 border-neon-green'
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className={`text-lg font-bold ${
                    value > 0 ? 'text-neon-green' : 'text-red-500'
                  }`}>
                    {value > 0 ? '+' : ''}{formatMetricValue(key as keyof ScenarioMetrics, value)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center text-gray-400">
          <p>Loading next decision...</p>
        </div>
      </motion.div>
    )
  }

  if (!currentDecision) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading scenario...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-neon-green">
            Decision {engine.getProgress().currentDecisionIndex + 1} of {scenario.decisions.length}
          </span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-2">
          <div
            className="bg-neon-green h-2 rounded-full transition-all"
            style={{
              width: `${((engine.getProgress().currentDecisionIndex + 1) / scenario.decisions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Current Metrics */}
      <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-4">
        <h4 className="text-sm font-bold text-neon-blue mb-3">Current Metrics</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(currentMetrics).slice(0, 6).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-xs text-gray-400 mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-sm font-bold text-white">
                {formatMetricValue(key as keyof ScenarioMetrics, value as number)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div className="bg-cyber-dark border border-neon-pink/30 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-neon-pink mb-4">{currentDecision.prompt}</h3>
        <p className="text-lg text-gray-300 mb-6">{currentDecision.description}</p>

        {/* Context Info */}
        {currentDecision.context?.additionalInfo && (
          <div className="bg-neon-blue/10 border border-neon-blue/30 rounded p-4 mb-6">
            <p className="text-sm text-neon-blue">{currentDecision.context.additionalInfo}</p>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          {currentDecision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleDecision(option.id)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-4 rounded border transition-all ${
                selectedOption === option.id
                  ? 'bg-neon-green/20 border-neon-green'
                  : 'bg-black/30 border-neon-pink/30 hover:border-neon-pink hover:bg-neon-pink/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-white">{option.label}</h4>
                {selectedOption === option.id && (
                  <span className="text-neon-green">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-400 hover:bg-gray-700 transition-all"
      >
        ← Exit Scenario
      </button>
    </div>
  )
}
