import type { SimulationState } from '@/lib/simulation/StartupSimulator'
import type { PlayerProgress } from '@/lib/gamification/AchievementSystem'

interface SavedSession {
  id: string
  simulationState: any
  playerProgress: PlayerProgress
  lastSaved: number
  version: string
}

const STORAGE_KEY = 'foundermind_session'
const VERSION = '1.0.0'

export class SessionStorage {
  static saveSession(
    simulationState: SimulationState,
    playerProgress: PlayerProgress
  ): void {
    try {
      const session: SavedSession = {
        id: `session_${Date.now()}`,
        simulationState,
        playerProgress,
        lastSaved: Date.now(),
        version: VERSION,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  static loadSession(): SavedSession | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null

      const session: SavedSession = JSON.parse(saved)

      // Version check
      if (session.version !== VERSION) {
        console.warn('Session version mismatch, starting fresh')
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to load session:', error)
      return null
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  static hasSession(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  static getLastSaveTime(): number | null {
    const session = this.loadSession()
    return session?.lastSaved || null
  }

  // Auto-save functionality
  static setupAutoSave(
    getState: () => { simulation: SimulationState; progress: PlayerProgress },
    interval: number = 30000 // 30 seconds
  ): () => void {
    const autoSaveInterval = setInterval(() => {
      const { simulation, progress } = getState()
      this.saveSession(simulation, progress)
    }, interval)

    return () => clearInterval(autoSaveInterval)
  }
}

// Quick save notification
export function showSaveNotification(): void {
  // Create temporary notification
  const notification = document.createElement('div')
  notification.className = 'fixed bottom-4 right-4 bg-cyber-dark border border-neon-green text-neon-green px-4 py-2 rounded-lg shadow-lg z-50'
  notification.innerHTML = '💾 Game saved'
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 2000)
}
