'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
  action?: string
  highlight?: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to FounderMind! 🚀',
    description: 'Learn to build and scale startups in a risk-free simulation. Make decisions, compete with others, and get AI-powered advice from experienced founders.',
    icon: '👋',
  },
  {
    id: 'choose-path',
    title: 'Choose Your Path',
    description: 'How do you want to start your FounderMind journey?',
    icon: '🛤️',
  },
  {
    id: 'simulation',
    title: 'Run Your Startup',
    description: 'Start with $10K and build your dream company. Manage burn rate, hire teams, and grow users. Watch your metrics in real-time.',
    icon: '📊',
    action: 'Try Dashboard',
    highlight: 'dashboard',
  },
  {
    id: 'advisors',
    title: 'Get Expert Advice',
    description: 'Chat with AI advisors who think like real founders. Ask Sarah (CEO), Marcus (CTO), David (CFO), Lisa (CMO), or James (Investor) for help.',
    icon: '🧠',
    action: 'Meet Advisors',
    highlight: 'advisors',
  },
  {
    id: 'compete',
    title: 'Battle Other Founders',
    description: 'Ready for competition? Face other players in real-time, poach their employees, and race to the top of the leaderboard.',
    icon: '⚔️',
    action: 'View Competitions',
    highlight: 'compete',
  },
]

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPath, setSelectedPath] = useState<'beginner' | 'experienced' | null>(null)

  const step = ONBOARDING_STEPS[currentStep]

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePathSelect = (path: 'beginner' | 'experienced') => {
    setSelectedPath(path)
    handleNext()
  }

  return (
    <div className="fixed inset-0 bg-cyber-darker/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="cyber-card max-w-2xl w-full relative">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-neon-blue transition-colors"
        >
          Skip ✕
        </button>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-neon-blue">
              {Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-cyber-dark rounded-full h-2">
            <div
              className="bg-neon-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{step.icon}</div>
          <h2 className="text-3xl font-bold text-neon-green mb-4">{step.title}</h2>
          <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
        </div>

        {/* Path selection (step 1) */}
        {step.id === 'choose-path' && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handlePathSelect('beginner')}
              className="p-6 bg-cyber-dark border border-neon-green/30 rounded-lg hover:border-neon-green transition-all"
            >
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-xl font-bold text-neon-green mb-2">I&apos;m New to Startups</h3>
              <p className="text-sm text-gray-400">
                Start with a guided tutorial and learn the fundamentals of building a startup.
              </p>
            </button>

            <button
              onClick={() => handlePathSelect('experienced')}
              className="p-6 bg-cyber-dark border border-neon-blue/30 rounded-lg hover:border-neon-blue transition-all"
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-bold text-neon-blue mb-2">I Know Startups</h3>
              <p className="text-sm text-gray-400">
                Jump right in and start competing. You know the drill.
              </p>
            </button>
          </div>
        )}

        {/* Action buttons for feature steps */}
        {step.action && (
          <div className="mb-6">
            <Button
              onClick={handleNext}
              className="w-full bg-neon-blue/20 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-cyber-darker"
            >
              {step.action} →
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-gray-500 hover:text-neon-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {!step.action && (
            <Button onClick={handleNext}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? "Let's Go!" : 'Next →'}
            </Button>
          )}

          <button
            onClick={handleNext}
            className="text-gray-500 hover:text-neon-blue transition-colors"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Skip to Next →'}
          </button>
        </div>

        {/* Helpful tip */}
        <div className="mt-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded">
          <p className="text-sm text-gray-400">
            💡 <strong className="text-neon-green">Tip:</strong>{' '}
            {selectedPath === 'beginner'
              ? 'Take your time learning each feature. There&apos;s no rush!'
              : 'You can access this tutorial anytime from your profile settings.'}
          </p>
        </div>
      </div>
    </div>
  )
}
