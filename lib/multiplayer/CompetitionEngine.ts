import type { StartupMetrics, MarketConditions } from '@/lib/types/database.types'
import { StartupSimulator } from '@/lib/simulation/StartupSimulator'
import { MarketDynamics } from '@/lib/simulation/MarketDynamics'

export type CompetitionStatus = 'waiting' | 'active' | 'completed'
export type CompetitionMode = 'head-to-head' | 'tournament' | 'marathon'

export interface Player {
  id: string
  userId: string
  username: string
  startupName: string
  simulator: StartupSimulator
  metrics: StartupMetrics
  actions: PlayerAction[]
  eliminated: boolean
}

export interface PlayerAction {
  id: string
  playerId: string
  type: 'hire' | 'fire' | 'poach' | 'marketing' | 'feature' | 'sabotage'
  target?: string // For actions targeting other players
  timestamp: number
  details: any
}

export interface CompetitionConfig {
  mode: CompetitionMode
  duration: number // in game days
  startingCapital: number
  industry: string
  maxPlayers: number
  allowPoaching: boolean
  allowSabotage: boolean
}

export interface CompetitionEvent {
  id: string
  type: 'player_joined' | 'player_action' | 'market_event' | 'player_eliminated' | 'winner_declared'
  playerId?: string
  message: string
  timestamp: number
  data: any
}

export class CompetitionEngine {
  private id: string
  private config: CompetitionConfig
  private players: Map<string, Player>
  private market: MarketDynamics
  private status: CompetitionStatus
  private currentDay: number
  private events: CompetitionEvent[]
  private winnerId: string | null

  constructor(id: string, config: CompetitionConfig, initialMarket: MarketConditions) {
    this.id = id
    this.config = config
    this.players = new Map()
    this.market = new MarketDynamics(initialMarket)
    this.status = 'waiting'
    this.currentDay = 0
    this.events = []
    this.winnerId = null
  }

  // Player Management
  addPlayer(userId: string, username: string, startupName: string): string {
    if (this.status !== 'waiting') {
      throw new Error('Cannot join: competition already started')
    }

    if (this.players.size >= this.config.maxPlayers) {
      throw new Error('Competition is full')
    }

    const playerId = `player_${userId}_${Date.now()}`
    const simulator = new StartupSimulator(startupName, this.config.industry, {
      startingCapital: this.config.startingCapital,
      difficulty: 'normal',
    })

    const player: Player = {
      id: playerId,
      userId,
      username,
      startupName,
      simulator,
      metrics: simulator.getMetrics(),
      actions: [],
      eliminated: false,
    }

    this.players.set(playerId, player)

    this.addEvent({
      type: 'player_joined',
      playerId,
      message: `${username} joined with startup "${startupName}"`,
      data: { startupName, username },
    })

    return playerId
  }

  removePlayer(playerId: string): void {
    const player = this.players.get(playerId)
    if (player) {
      player.eliminated = true
      this.addEvent({
        type: 'player_eliminated',
        playerId,
        message: `${player.username} has left the competition`,
        data: { reason: 'voluntary_exit' },
      })
    }
  }

  // Competition Lifecycle
  start(): void {
    if (this.status !== 'waiting') {
      throw new Error('Competition already started')
    }

    if (this.players.size < 2) {
      throw new Error('Need at least 2 players to start')
    }

    this.status = 'active'
    this.addEvent({
      type: 'market_event',
      message: `Competition started! ${this.players.size} startups competing in ${this.config.industry}`,
      data: { playerCount: this.players.size },
    })
  }

  tick(): void {
    if (this.status !== 'active') return

    this.currentDay++

    // Update all players
    this.players.forEach((player) => {
      if (!player.eliminated) {
        // Tick player's simulator
        player.simulator['tick']?.() // Access private method for competition
        player.metrics = player.simulator.getMetrics()

        // Check elimination conditions
        if (player.metrics.runway <= 0) {
          this.eliminatePlayer(player.id, 'Out of money')
        }
      }
    })

    // Update market dynamics
    const activePlayers = Array.from(this.players.values()).filter((p) => !p.eliminated)
    if (activePlayers.length > 0) {
      const avgMetrics = this.calculateAverageMetrics(activePlayers)
      this.market.updatePlayerMarketShare(avgMetrics)
    }

    // Check win conditions
    if (this.currentDay >= this.config.duration) {
      this.endCompetition()
    } else if (activePlayers.length === 1) {
      this.declareWinner(activePlayers[0].id)
    }
  }

  // Player Actions
  executeAction(playerId: string, action: Omit<PlayerAction, 'id' | 'playerId' | 'timestamp'>): void {
    const player = this.players.get(playerId)
    if (!player || player.eliminated) {
      throw new Error('Invalid player or player eliminated')
    }

    const fullAction: PlayerAction = {
      ...action,
      id: `action_${Date.now()}`,
      playerId,
      timestamp: Date.now(),
    }

    player.actions.push(fullAction)

    // Execute action based on type
    switch (action.type) {
      case 'poach':
        this.executePoach(player, action.target!, action.details)
        break
      case 'sabotage':
        this.executeSabotage(player, action.target!, action.details)
        break
      case 'hire':
      case 'marketing':
      case 'feature':
        // These go through normal decision engine
        player.simulator.processDecision(action.type as any, action.details)
        break
    }

    this.addEvent({
      type: 'player_action',
      playerId,
      message: `${player.username} executed ${action.type}`,
      data: action,
    })
  }

  private executePoach(player: Player, targetId: string, details: any): void {
    if (!this.config.allowPoaching) {
      throw new Error('Poaching not allowed in this competition')
    }

    const target = this.players.get(targetId)
    if (!target || target.eliminated) {
      throw new Error('Invalid target')
    }

    const cost = details.offer || 50000
    const successChance = this.calculatePoachChance(player, target, cost)

    if (Math.random() < successChance) {
      // Success!
      player.metrics.team_size++
      player.metrics.burn_rate += cost / 12 // Annualized
      target.metrics.team_size = Math.max(1, target.metrics.team_size - 1)
      target.metrics.team_morale -= 15

      this.addEvent({
        type: 'player_action',
        playerId: player.id,
        message: `${player.username} successfully poached an employee from ${target.username}!`,
        data: { success: true, cost },
      })
    } else {
      // Failed - lose money anyway
      player.metrics.valuation -= cost * 0.5

      this.addEvent({
        type: 'player_action',
        playerId: player.id,
        message: `${player.username}'s poaching attempt failed`,
        data: { success: false, cost },
      })
    }
  }

  private calculatePoachChance(attacker: Player, defender: Player, offer: number): number {
    const basChance = 0.3
    const moraleBonus = (100 - defender.metrics.team_morale) / 200 // 0-0.5
    const offerBonus = Math.min(0.3, offer / 200000) // Up to 0.3 for big offers
    return Math.min(0.9, basChance + moraleBonus + offerBonus)
  }

  private executeSabotage(player: Player, targetId: string, details: any): void {
    if (!this.config.allowSabotage) {
      throw new Error('Sabotage not allowed in this competition')
    }

    const target = this.players.get(targetId)
    if (!target || target.eliminated) {
      throw new Error('Invalid target')
    }

    const sabotageType = details.sabotageType || 'ddos'
    const cost = 10000

    // Sabotage effects
    switch (sabotageType) {
      case 'ddos':
        target.metrics.customer_satisfaction -= 20
        target.metrics.user_count *= 0.9
        break
      case 'poach_clients':
        const stolenUsers = Math.floor(target.metrics.user_count * 0.1)
        target.metrics.user_count -= stolenUsers
        player.metrics.user_count += stolenUsers
        break
      case 'bad_press':
        target.metrics.user_growth_rate -= 5
        target.metrics.team_morale -= 10
        break
    }

    player.metrics.valuation -= cost

    this.addEvent({
      type: 'player_action',
      playerId: player.id,
      message: `${player.username} launched a ${sabotageType} attack on ${target.username}!`,
      data: { sabotageType, target: target.username },
    })
  }

  // Competition End
  private eliminatePlayer(playerId: string, reason: string): void {
    const player = this.players.get(playerId)
    if (player) {
      player.eliminated = true
      this.addEvent({
        type: 'player_eliminated',
        playerId,
        message: `${player.username} has been eliminated: ${reason}`,
        data: { reason },
      })
    }
  }

  private endCompetition(): void {
    this.status = 'completed'

    // Find winner by highest valuation
    const rankings = this.getRankings()
    if (rankings.length > 0) {
      this.declareWinner(rankings[0].playerId)
    }
  }

  private declareWinner(playerId: string): void {
    this.winnerId = playerId
    this.status = 'completed'

    const winner = this.players.get(playerId)
    if (winner) {
      this.addEvent({
        type: 'winner_declared',
        playerId,
        message: `🏆 ${winner.username} wins with "${winner.startupName}"!`,
        data: {
          valuation: winner.metrics.valuation,
          users: winner.metrics.user_count,
          mrr: winner.metrics.mrr,
        },
      })
    }
  }

  // Getters
  getState() {
    return {
      id: this.id,
      status: this.status,
      currentDay: this.currentDay,
      config: this.config,
      playerCount: this.players.size,
      activePlayers: Array.from(this.players.values()).filter((p) => !p.eliminated).length,
      winnerId: this.winnerId,
    }
  }

  getPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId)
  }

  getRankings(): Array<{ playerId: string; username: string; score: number; metrics: StartupMetrics }> {
    return Array.from(this.players.values())
      .filter((p) => !p.eliminated)
      .map((p) => ({
        playerId: p.id,
        username: p.username,
        score: this.calculateScore(p),
        metrics: p.metrics,
      }))
      .sort((a, b) => b.score - a.score)
  }

  private calculateScore(player: Player): number {
    const { metrics } = player
    return (
      metrics.valuation +
      metrics.user_count * 10 +
      metrics.mrr * 12 + // Annualized
      metrics.team_size * 5000 +
      metrics.product_quality * 1000
    )
  }

  getEvents(since?: number): CompetitionEvent[] {
    if (since) {
      return this.events.filter((e) => e.timestamp > since)
    }
    return [...this.events]
  }

  private addEvent(event: Omit<CompetitionEvent, 'id' | 'timestamp'>): void {
    this.events.push({
      ...event,
      id: `event_${Date.now()}`,
      timestamp: Date.now(),
    })
  }

  private calculateAverageMetrics(players: Player[]): StartupMetrics {
    const sum = players.reduce(
      (acc, p) => {
        Object.keys(acc).forEach((key) => {
          acc[key as keyof StartupMetrics] += p.metrics[key as keyof StartupMetrics] as number
        })
        return acc
      },
      {
        burn_rate: 0,
        runway: 0,
        mrr: 0,
        user_count: 0,
        user_growth_rate: 0,
        team_size: 0,
        team_morale: 0,
        product_quality: 0,
        market_share: 0,
        valuation: 0,
        customer_satisfaction: 0,
      }
    )

    const count = players.length
    Object.keys(sum).forEach((key) => {
      sum[key as keyof StartupMetrics] = (sum[key as keyof StartupMetrics] as number) / count
    })

    return sum
  }
}
