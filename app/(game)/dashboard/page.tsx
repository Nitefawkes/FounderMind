'use client'

import { useState, useEffect } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { Button } from '@/components/ui/Button'
import { EventLog } from '@/components/ui/EventLog'
import { StartupSimulator } from '@/lib/simulation/StartupSimulator'

export default function DashboardPage() {
  const [simulator, setSimulator] = useState<StartupSimulator | null>(null)
  const [state, setState] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Initialize simulator
    const sim = new StartupSimulator('My Startup', 'B2B SaaS')
    setSimulator(sim)
    setState(sim.getState())
  }, [])

  useEffect(() => {
    if (!simulator || !isRunning) return

    // Update state every second
    const interval = setInterval(() => {
      setState(simulator.getState())
    }, 1000)

    return () => clearInterval(interval)
  }, [simulator, isRunning])

  const handleStart = () => {
    if (simulator) {
      simulator.start(1000) // Tick every second
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    if (simulator) {
      simulator.pause()
      setIsRunning(false)
    }
  }

  const handleStop = () => {
    if (simulator) {
      simulator.stop()
      setIsRunning(false)
      setState(simulator.getState())
    }
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="text-neon-green text-xl">Loading simulation...</div>
      </div>
    )
  }

  const metrics = state.metrics

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-neon-green">{state.name}</span>
        </h1>
        <p className="text-gray-400">{state.industry} • Day {state.currentDay}</p>
      </div>

      {/* Control Panel */}
      <div className="mb-8 flex gap-4">
        {!isRunning ? (
          <Button onClick={handleStart}>Start Simulation</Button>
        ) : (
          <Button onClick={handlePause} variant="secondary">Pause</Button>
        )}
        <Button onClick={handleStop} variant="danger">Stop</Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Current Capital"
          value={`$${(metrics.valuation || 10000).toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <MetricCard
          label="Runway"
          value={`${metrics.runway} months`}
          icon="⏱️"
          color={metrics.runway < 3 ? 'pink' : 'blue'}
        />
        <MetricCard
          label="Monthly Burn"
          value={`$${metrics.burn_rate.toLocaleString()}/mo`}
          icon="🔥"
          color="pink"
        />
        <MetricCard
          label="MRR"
          value={`$${metrics.mrr.toLocaleString()}/mo`}
          icon="📈"
          color="green"
          trend={metrics.mrr > 0 ? 'up' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Users"
          value={metrics.user_count.toLocaleString()}
          icon="👥"
          color="blue"
        />
        <MetricCard
          label="Growth Rate"
          value={`${metrics.user_growth_rate.toFixed(1)}%`}
          icon="📊"
          color="green"
        />
        <MetricCard
          label="Team Size"
          value={metrics.team_size}
          icon="👨‍💼"
          color="blue"
        />
        <MetricCard
          label="Team Morale"
          value={`${metrics.team_morale}/100`}
          icon="😊"
          color={metrics.team_morale > 70 ? 'green' : metrics.team_morale > 40 ? 'blue' : 'pink'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          label="Product Quality"
          value={`${metrics.product_quality.toFixed(0)}/100`}
          icon="⚙️"
          color="green"
        />
        <MetricCard
          label="Customer Satisfaction"
          value={`${metrics.customer_satisfaction}/100`}
          icon="⭐"
          color="blue"
        />
        <MetricCard
          label="Market Share"
          value={`${metrics.market_share.toFixed(2)}%`}
          icon="🎯"
          color="pink"
        />
      </div>

      {/* Event Log */}
      <EventLog events={state.eventHistory} />

      {/* Market Info */}
      <div className="mt-8 cyber-card">
        <h3 className="text-xl font-bold text-neon-blue mb-4">Market Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Market Size</p>
            <p className="text-white font-semibold">${(state.market.market_size / 1000000000).toFixed(1)}B</p>
          </div>
          <div>
            <p className="text-gray-400">Growth Rate</p>
            <p className="text-white font-semibold">{state.market.growth_rate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-400">Competition</p>
            <p className="text-white font-semibold">{state.market.competition_level.toFixed(0)}/100</p>
          </div>
          <div>
            <p className="text-gray-400">Economic Cycle</p>
            <p className="text-white font-semibold capitalize">{state.market.economic_cycle}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400 mb-2">Trends</p>
          <div className="flex flex-wrap gap-2">
            {state.market.trends.map((trend: string) => (
              <span
                key={trend}
                className="px-3 py-1 bg-cyber-gray border border-neon-blue/30 rounded-full text-sm text-neon-blue"
              >
                {trend}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
