'use client'

import { useState, useEffect } from 'react'
import { PersonaCard } from '@/components/advisors/PersonaCard'
import { AdvisorChat } from '@/components/advisors/AdvisorChat'
import { PersonaEngine, type PersonaConfig } from '@/lib/ai/PersonaEngine'
import { StartupSimulator } from '@/lib/simulation/StartupSimulator'
import type { AdvisorPersona } from '@/lib/types/database.types'

export default function AdvisorsPage() {
  const [selectedPersona, setSelectedPersona] = useState<AdvisorPersona>('ceo')
  const [personas, setPersonas] = useState<PersonaConfig[]>([])
  const [simulator, setSimulator] = useState<StartupSimulator | null>(null)
  const [conversationHistory, setConversationHistory] = useState<
    Record<AdvisorPersona, Array<{ role: 'user' | 'assistant'; content: string }>>
  >({
    ceo: [],
    cto: [],
    cfo: [],
    cmo: [],
    investor: [],
  })

  useEffect(() => {
    // Load personas
    const engine = new PersonaEngine()
    setPersonas(engine.getAllPersonas())

    // Initialize simulator for context
    const sim = new StartupSimulator('My Startup', 'B2B SaaS')
    setSimulator(sim)
  }, [])

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!simulator) return 'Simulator not initialized'

    const state = simulator.getState()

    const context = {
      startupName: state.name,
      industry: state.industry,
      metrics: state.metrics,
      market: state.market,
      conversationHistory: conversationHistory[selectedPersona],
      recentEvents: state.eventHistory.slice(-5).map((e) => `${e.title}: ${e.description}`),
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: selectedPersona,
          message,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Update conversation history
      setConversationHistory((prev) => ({
        ...prev,
        [selectedPersona]: [
          ...prev[selectedPersona],
          { role: 'user', content: message },
          { role: 'assistant', content: data.advice },
        ],
      }))

      return data.advice
    } catch (error) {
      console.error('Error sending message:', error)
      return "I'm having trouble connecting right now. Make sure your OPENAI_API_KEY is set in your .env file."
    }
  }

  const currentPersona = personas.find((p) => p.id === selectedPersona)

  if (!simulator || personas.length === 0) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="text-neon-green text-xl">Loading advisors...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neon-green mb-2">AI Board of Advisors</h1>
        <p className="text-gray-400">
          Get expert advice from seasoned founders, executives, and investors
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Advisor Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-neon-blue mb-4">Your Advisors</h2>
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              isActive={persona.id === selectedPersona}
              onClick={() => setSelectedPersona(persona.id as AdvisorPersona)}
            />
          ))}
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {currentPersona && (
            <div>
              <div className="mb-4 p-4 bg-cyber-gray rounded-lg border border-neon-blue/30">
                <p className="text-sm text-gray-400 mb-2">
                  <span className="text-neon-blue font-semibold">Expertise:</span>{' '}
                  {currentPersona.expertise.join(', ')}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="text-neon-blue font-semibold">Background:</span>{' '}
                  {currentPersona.background}
                </p>
              </div>

              <AdvisorChat
                persona={currentPersona}
                onSendMessage={handleSendMessage}
              />

              <div className="mt-4 p-4 bg-cyber-gray/50 rounded-lg border border-neon-green/20">
                <p className="text-xs text-gray-500 mb-2">💡 SUGGESTED QUESTIONS:</p>
                <div className="space-y-2">
                  {currentPersona.when_to_ask.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(`Help me with: ${question}`)}
                      className="block w-full text-left text-sm text-neon-green hover:text-neon-blue transition-colors"
                    >
                      → {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 cyber-card">
        <h3 className="text-xl font-bold text-neon-pink mb-4">Current Startup Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Burn Rate</p>
            <p className="text-white font-semibold">
              ${simulator.getMetrics().burn_rate.toLocaleString()}/mo
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Runway</p>
            <p className="text-white font-semibold">{simulator.getMetrics().runway} months</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">MRR</p>
            <p className="text-white font-semibold">
              ${simulator.getMetrics().mrr.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Users</p>
            <p className="text-white font-semibold">
              {simulator.getMetrics().user_count.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
