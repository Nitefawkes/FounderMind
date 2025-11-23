/**
 * Easter Eggs - Hidden features and surprises
 */

export type EasterEggType =
  | 'konami-code'
  | 'secret-phrase'
  | 'achievement-hunter'
  | 'time-traveler'
  | 'developer-mode'
  | 'secret-advisor'
  | 'hidden-scenario'

export interface EasterEgg {
  id: string
  type: EasterEggType
  title: string
  description: string
  trigger: string | string[] | (() => boolean)
  reward: {
    xp?: number
    achievement?: string
    unlock?: string
    message: string
  }
  isDiscovered: boolean
}

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'konami-code',
    type: 'konami-code',
    title: 'The Konami Code',
    description: 'Enter the legendary cheat code: ↑ ↑ ↓ ↓ ← → ← → B A',
    trigger: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    reward: {
      xp: 1000,
      achievement: 'code-master',
      message: '🎮 Konami Code Activated! You found the legendary secret! +1000 XP'
    },
    isDiscovered: false
  },
  {
    id: 'steve-jobs-quote',
    type: 'secret-phrase',
    title: 'Stay Hungry, Stay Foolish',
    description: 'Type "stay hungry stay foolish" in the advisor chat',
    trigger: 'stay hungry stay foolish',
    reward: {
      xp: 500,
      achievement: 'stanford-graduate',
      unlock: 'steve-jobs-advisor',
      message: '💡 "Stay Hungry, Stay Foolish" - Steve Jobs\' special wisdom unlocked!'
    },
    isDiscovered: false
  },
  {
    id: 'achievement-perfectionist',
    type: 'achievement-hunter',
    title: 'The Perfectionist',
    description: 'Complete 10 scenarios with perfect scores',
    trigger: () => false, // Checked programmatically
    reward: {
      xp: 2000,
      achievement: 'perfectionist',
      message: '💎 Perfectionist! You&apos;ve mastered the art of decision-making!'
    },
    isDiscovered: false
  },
  {
    id: 'time-traveler',
    type: 'time-traveler',
    title: 'Time Traveler',
    description: 'Change your system time to experience all daily challenges',
    trigger: () => false, // Detected when same user completes challenges from different dates on same day
    reward: {
      xp: 100,
      achievement: 'time-traveler',
      message: '⏰ Time Traveler discovered! We see what you did there... 😏'
    },
    isDiscovered: false
  },
  {
    id: 'developer-console',
    type: 'developer-mode',
    title: 'Developer Mode',
    description: 'Open browser console and type: foundermind.dev.enable()',
    trigger: 'developer.mode.enabled',
    reward: {
      unlock: 'developer-tools',
      message: '🔧 Developer Mode Activated! You now have access to advanced simulation tools.'
    },
    isDiscovered: false
  },
  {
    id: 'unicorn-hunter',
    type: 'secret-phrase',
    title: 'Unicorn Hunter',
    description: 'Reach unicorn status ($1B valuation) 3 times',
    trigger: () => false, // Checked programmatically
    reward: {
      xp: 5000,
      achievement: 'serial-unicorn',
      message: '🦄🦄🦄 Serial Unicorn Founder! You&apos;ve built multiple billion-dollar companies!'
    },
    isDiscovered: false
  },
  {
    id: 'zero-to-hero',
    type: 'hidden-scenario',
    title: 'Zero to Hero',
    description: 'Recover from $0 cash and survive 30 more days',
    trigger: () => false, // Checked when cash hits 0 and then recovers
    reward: {
      xp: 1500,
      achievement: 'phoenix',
      unlock: 'phoenix-scenario',
      message: '🔥 Phoenix! You rose from the ashes of bankruptcy!'
    },
    isDiscovered: false
  },
  {
    id: 'advisor-party',
    type: 'secret-advisor',
    title: 'Advisor Party',
    description: 'Talk to all 5 advisors in a single day',
    trigger: () => false,
    reward: {
      xp: 300,
      achievement: 'social-butterfly',
      message: '🎉 Advisor Party! You&apos;ve networked with the entire board in one day!'
    },
    isDiscovered: false
  },
  {
    id: 'speed-runner',
    type: 'hidden-scenario',
    title: 'Speed Runner',
    description: 'Reach $1M MRR in under 100 days',
    trigger: () => false,
    reward: {
      xp: 2500,
      achievement: 'speed-runner',
      message: '⚡ Speed Runner! Your growth velocity is legendary!'
    },
    isDiscovered: false
  },
  {
    id: 'crisis-manager',
    type: 'achievement-hunter',
    title: 'Crisis Manager',
    description: 'Successfully handle 50 crisis events',
    trigger: () => false,
    reward: {
      xp: 1000,
      achievement: 'crisis-manager',
      unlock: 'advanced-crisis-scenarios',
      message: '🔥 Crisis Manager! You thrive under pressure!'
    },
    isDiscovered: false
  },
  {
    id: 'the-matrix',
    type: 'secret-phrase',
    title: 'I Know Kung Fu',
    description: 'Type "i know kung fu" anywhere in the app',
    trigger: 'i know kung fu',
    reward: {
      xp: 777,
      achievement: 'the-one',
      message: '🥋 "Show me." - Morpheus. You&apos;ve entered the Matrix!'
    },
    isDiscovered: false
  },
  {
    id: '42',
    type: 'secret-phrase',
    title: 'The Answer',
    description: 'Type "42" when asked a difficult question',
    trigger: '42',
    reward: {
      xp: 420,
      achievement: 'hitchhiker',
      message: '🌌 The Answer to Life, the Universe, and Everything!'
    },
    isDiscovered: false
  }
]

export class EasterEggTracker {
  private discovered: Set<string> = new Set()
  private keySequence: string[] = []
  private readonly MAX_SEQUENCE_LENGTH = 10

  constructor() {
    // Load discovered eggs from localStorage
    const saved = localStorage.getItem('discoveredEasterEggs')
    if (saved) {
      this.discovered = new Set(JSON.parse(saved))
    }
  }

  /**
   * Track key presses for Konami code and other sequences
   */
  trackKeyPress(key: string): EasterEgg | null {
    this.keySequence.push(key.toLowerCase())

    // Keep only last N keys
    if (this.keySequence.length > this.MAX_SEQUENCE_LENGTH) {
      this.keySequence.shift()
    }

    // Check for Konami code
    const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
    if (this.checkSequence(konamiCode)) {
      return this.discover('konami-code')
    }

    return null
  }

  /**
   * Check if key sequence matches target
   */
  private checkSequence(target: string[]): boolean {
    if (this.keySequence.length < target.length) return false

    const recent = this.keySequence.slice(-target.length)
    return recent.every((key, i) => key === target[i])
  }

  /**
   * Track text input for secret phrases
   */
  trackTextInput(text: string): EasterEgg | null {
    const normalized = text.toLowerCase().trim()

    // Check all secret phrase eggs
    for (const egg of EASTER_EGGS) {
      if (egg.type === 'secret-phrase' && typeof egg.trigger === 'string') {
        if (normalized.includes(egg.trigger.toLowerCase())) {
          return this.discover(egg.id)
        }
      }
    }

    return null
  }

  /**
   * Discover an easter egg
   */
  discover(eggId: string): EasterEgg | null {
    if (this.discovered.has(eggId)) {
      return null // Already discovered
    }

    const egg = EASTER_EGGS.find(e => e.id === eggId)
    if (!egg) return null

    this.discovered.add(eggId)
    this.save()

    return egg
  }

  /**
   * Check if egg is discovered
   */
  isDiscovered(eggId: string): boolean {
    return this.discovered.has(eggId)
  }

  /**
   * Get all discovered eggs
   */
  getDiscovered(): EasterEgg[] {
    return EASTER_EGGS.filter(egg => this.discovered.has(egg.id))
  }

  /**
   * Get discovery count
   */
  getDiscoveryCount(): { discovered: number; total: number } {
    return {
      discovered: this.discovered.size,
      total: EASTER_EGGS.length
    }
  }

  /**
   * Save to localStorage
   */
  private save(): void {
    localStorage.setItem('discoveredEasterEggs', JSON.stringify([...this.discovered]))
  }

  /**
   * Initialize global listener for easter eggs
   */
  static initializeGlobalListeners(): EasterEggTracker {
    const tracker = new EasterEggTracker()

    // Listen for key presses
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        const egg = tracker.trackKeyPress(e.key)
        if (egg) {
          // Show notification
          console.log('🎉 EASTER EGG FOUND:', egg.reward.message)
          // Could trigger toast notification here
        }
      })

      // Add global object for developer mode
      ;(window as any).foundermind = {
        dev: {
          enable: () => {
            const egg = tracker.discover('developer-console')
            if (egg) {
              console.log('🔧', egg.reward.message)
              return 'Developer mode enabled! Check your achievements.'
            }
            return 'Developer mode already enabled.'
          },
          stats: () => {
            const count = tracker.getDiscoveryCount()
            console.log(`📊 Easter Eggs: ${count.discovered}/${count.total} discovered`)
            return tracker.getDiscovered()
          }
        }
      }

      // Console easter egg message
      console.log('%c🚀 Welcome to FounderMind!', 'font-size: 20px; color: #00FFB2; font-weight: bold;')
      console.log('%cTry typing: foundermind.dev.enable()', 'font-size: 14px; color: #FF00E5;')
    }

    return tracker
  }
}

// Initialize on import
export const globalEasterEggTracker = typeof window !== 'undefined'
  ? EasterEggTracker.initializeGlobalListeners()
  : null
