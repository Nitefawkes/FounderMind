import type { CompetitionConfig, CompetitionMode } from './CompetitionEngine'

export interface MatchmakingQueue {
  userId: string
  username: string
  skill_level: number
  preferences: {
    mode: CompetitionMode
    industry?: string
  }
  joinedAt: number
}

export interface Match {
  id: string
  players: string[]
  config: CompetitionConfig
  createdAt: number
}

export class Matchmaking {
  private queue: Map<string, MatchmakingQueue>
  private matches: Map<string, Match>

  constructor() {
    this.queue = new Map()
    this.matches = new Map()
  }

  // Join matchmaking queue
  joinQueue(entry: MatchmakingQueue): void {
    this.queue.set(entry.userId, entry)
  }

  // Leave queue
  leaveQueue(userId: string): void {
    this.queue.delete(userId)
  }

  // Find match
  findMatch(userId: string): Match | null {
    const player = this.queue.get(userId)
    if (!player) return null

    // Look for similar players
    const candidates = Array.from(this.queue.values()).filter(
      (p) =>
        p.userId !== userId &&
        p.preferences.mode === player.preferences.mode &&
        Math.abs(p.skill_level - player.skill_level) < 200 // Skill range
    )

    if (candidates.length === 0) return null

    // Create match with best candidate
    const opponent = candidates[0]
    const match = this.createMatch([player.userId, opponent.userId], player.preferences.mode)

    // Remove from queue
    this.queue.delete(userId)
    this.queue.delete(opponent.userId)

    return match
  }

  // Auto-matchmake (run periodically)
  autoMatch(): Match[] {
    const newMatches: Match[] = []

    // Group by mode
    const byMode = new Map<CompetitionMode, MatchmakingQueue[]>()
    this.queue.forEach((player) => {
      const mode = player.preferences.mode
      if (!byMode.has(mode)) {
        byMode.set(mode, [])
      }
      byMode.get(mode)!.push(player)
    })

    // Match within each mode
    byMode.forEach((players, mode) => {
      // Sort by skill
      players.sort((a, b) => a.skill_level - b.skill_level)

      // Create matches for pairs
      for (let i = 0; i < players.length - 1; i += 2) {
        const p1 = players[i]
        const p2 = players[i + 1]

        const match = this.createMatch([p1.userId, p2.userId], mode)
        newMatches.push(match)

        this.queue.delete(p1.userId)
        this.queue.delete(p2.userId)
      }
    })

    return newMatches
  }

  private createMatch(playerIds: string[], mode: CompetitionMode): Match {
    const matchId = `match_${Date.now()}`

    const config: CompetitionConfig = {
      mode,
      duration: mode === 'marathon' ? 365 : mode === 'tournament' ? 90 : 30,
      startingCapital: 10000,
      industry: 'B2B SaaS',
      maxPlayers: playerIds.length,
      allowPoaching: mode !== 'marathon',
      allowSabotage: mode === 'tournament',
    }

    const match: Match = {
      id: matchId,
      players: playerIds,
      config,
      createdAt: Date.now(),
    }

    this.matches.set(matchId, match)
    return match
  }

  getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId)
  }

  getQueueStatus(mode?: CompetitionMode): {
    total: number
    byMode: Record<CompetitionMode, number>
    avgWaitTime: number
  } {
    const total = this.queue.size
    const byMode: Record<CompetitionMode, number> = {
      'head-to-head': 0,
      tournament: 0,
      marathon: 0,
    }

    let totalWait = 0
    const now = Date.now()

    this.queue.forEach((player) => {
      byMode[player.preferences.mode]++
      totalWait += now - player.joinedAt
    })

    return {
      total,
      byMode,
      avgWaitTime: total > 0 ? totalWait / total : 0,
    }
  }
}

// Singleton instance
let matchmakingInstance: Matchmaking | null = null

export function getMatchmaking(): Matchmaking {
  if (!matchmakingInstance) {
    matchmakingInstance = new Matchmaking()
  }
  return matchmakingInstance
}
