import type { StartupMetrics, DecisionType, MarketConditions } from '@/lib/types/database.types'

export interface SimulationConfig {
  startingCapital: number
  timeUnit: 'day' | 'week' | 'month'
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare'
}

export interface SimulationState {
  id: string
  name: string
  industry: string
  metrics: StartupMetrics
  currentDay: number
  currentWeek: number
  currentMonth: number
  market: MarketConditions
  eventHistory: SimulationEvent[]
  isRunning: boolean
  isPaused: boolean
}

export interface SimulationEvent {
  id: string
  type: 'decision' | 'market' | 'crisis' | 'opportunity' | 'milestone'
  title: string
  description: string
  impact: Partial<StartupMetrics>
  timestamp: number
  day: number
}

export class StartupSimulator {
  private state: SimulationState
  private config: SimulationConfig
  private tickInterval: NodeJS.Timeout | null = null

  constructor(
    startupName: string,
    industry: string,
    config: Partial<SimulationConfig> = {}
  ) {
    this.config = {
      startingCapital: config.startingCapital || 10000,
      timeUnit: config.timeUnit || 'week',
      difficulty: config.difficulty || 'normal',
    }

    this.state = this.initializeState(startupName, industry)
  }

  private initializeState(name: string, industry: string): SimulationState {
    return {
      id: this.generateId(),
      name,
      industry,
      currentDay: 0,
      currentWeek: 0,
      currentMonth: 0,
      metrics: {
        burn_rate: this.getInitialBurnRate(),
        runway: this.calculateRunway(this.config.startingCapital, this.getInitialBurnRate()),
        mrr: 0,
        user_count: 0,
        user_growth_rate: 0,
        team_size: 1, // Just the founder
        team_morale: 80,
        product_quality: 30, // Starting low
        market_share: 0,
        valuation: 0,
        customer_satisfaction: 50,
      },
      market: this.generateMarketConditions(industry),
      eventHistory: [],
      isRunning: false,
      isPaused: false,
    }
  }

  private getInitialBurnRate(): number {
    const baseRate = 5000 // $5k/month base
    const difficultyMultiplier = {
      easy: 0.7,
      normal: 1.0,
      hard: 1.3,
      nightmare: 1.7,
    }
    return baseRate * difficultyMultiplier[this.config.difficulty]
  }

  private calculateRunway(capital: number, burnRate: number): number {
    if (burnRate <= 0) return 999
    return Math.floor(capital / burnRate)
  }

  private generateMarketConditions(industry: string): MarketConditions {
    const marketSizes: Record<string, number> = {
      'B2B SaaS': 250000000000, // $250B
      'B2C Mobile': 150000000000, // $150B
      'E-Commerce': 500000000000, // $500B
      'Fintech': 300000000000, // $300B
      'Healthcare': 400000000000, // $400B
      'EdTech': 100000000000, // $100B
      default: 100000000000, // $100B
    }

    return {
      industry,
      market_size: marketSizes[industry] || marketSizes.default,
      growth_rate: 5 + Math.random() * 15, // 5-20% annual growth
      competition_level: 30 + Math.random() * 50, // 30-80
      economic_cycle: 'normal',
      trends: this.generateTrends(industry),
    }
  }

  private generateTrends(industry: string): string[] {
    const trendsDB: Record<string, string[]> = {
      'B2B SaaS': ['AI Integration', 'Remote Work Tools', 'API-First', 'No-Code'],
      'B2C Mobile': ['Social Commerce', 'Short Video', 'AR Features', 'Web3'],
      'E-Commerce': ['Same-Day Delivery', 'Sustainability', 'Live Shopping', 'Personalization'],
      'Fintech': ['DeFi', 'Buy Now Pay Later', 'Crypto', 'Open Banking'],
      'Healthcare': ['Telemedicine', 'AI Diagnosis', 'Wearables', 'Mental Health'],
      'EdTech': ['Micro-credentials', 'AI Tutoring', 'VR Learning', 'Skills-Based'],
    }

    const trends = trendsDB[industry] || ['Innovation', 'Growth', 'Technology']
    return trends.slice(0, 2 + Math.floor(Math.random() * 2))
  }

  private generateId(): string {
    return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Public API

  getState(): SimulationState {
    return { ...this.state }
  }

  getMetrics(): StartupMetrics {
    return { ...this.state.metrics }
  }

  start(tickSpeed: number = 1000): void {
    if (this.state.isRunning) return

    this.state.isRunning = true
    this.state.isPaused = false

    this.tickInterval = setInterval(() => {
      if (!this.state.isPaused) {
        this.tick()
      }
    }, tickSpeed)
  }

  pause(): void {
    this.state.isPaused = true
  }

  resume(): void {
    this.state.isPaused = false
  }

  stop(): void {
    this.state.isRunning = false
    this.state.isPaused = false
    if (this.tickInterval) {
      clearInterval(this.tickInterval)
      this.tickInterval = null
    }
  }

  private tick(): void {
    this.state.currentDay++

    // Update time tracking
    if (this.state.currentDay % 7 === 0) {
      this.state.currentWeek++
    }
    if (this.state.currentDay % 30 === 0) {
      this.state.currentMonth++
      this.processMonthlyUpdates()
    }

    // Daily updates
    this.processDailyUpdates()

    // Random events (5% chance per day)
    if (Math.random() < 0.05) {
      this.triggerRandomEvent()
    }
  }

  private processDailyUpdates(): void {
    const dailyUserGrowth = this.calculateDailyUserGrowth()
    this.updateMetric('user_count', this.state.metrics.user_count + dailyUserGrowth)

    // Product quality slowly improves with time (team working)
    const qualityImprovement = (this.state.metrics.team_size * 0.1) / 30 // Per day
    this.updateMetric('product_quality', Math.min(100, this.state.metrics.product_quality + qualityImprovement))
  }

  private processMonthlyUpdates(): void {
    // Calculate revenue
    const revenue = this.state.metrics.mrr

    // Deduct burn
    const netBurn = this.state.metrics.burn_rate - revenue

    // Update metrics
    this.state.metrics.runway = this.calculateRunway(
      this.state.metrics.valuation || this.config.startingCapital,
      netBurn
    )

    // Update morale based on runway
    if (this.state.metrics.runway < 3) {
      this.updateMetric('team_morale', Math.max(0, this.state.metrics.team_morale - 10))
    } else if (this.state.metrics.runway > 12) {
      this.updateMetric('team_morale', Math.min(100, this.state.metrics.team_morale + 5))
    }

    // Check for game over
    if (this.state.metrics.runway <= 0) {
      this.triggerGameOver('Out of money!')
    }
  }

  private calculateDailyUserGrowth(): number {
    const baseGrowth = this.state.metrics.user_count * (this.state.metrics.user_growth_rate / 100) / 30
    const qualityMultiplier = this.state.metrics.product_quality / 100
    const marketMultiplier = (100 - this.state.market.competition_level) / 100

    return Math.floor(baseGrowth * qualityMultiplier * marketMultiplier)
  }

  private updateMetric<K extends keyof StartupMetrics>(
    metric: K,
    value: StartupMetrics[K]
  ): void {
    this.state.metrics[metric] = value
  }

  private triggerRandomEvent(): void {
    const events = [
      {
        type: 'opportunity' as const,
        title: 'Viral Moment!',
        description: 'Your product got mentioned by an influencer',
        impact: { user_count: this.state.metrics.user_count * 0.2, team_morale: 10 },
      },
      {
        type: 'crisis' as const,
        title: 'Server Outage',
        description: 'Technical issues caused downtime',
        impact: { customer_satisfaction: -15, team_morale: -5 },
      },
      {
        type: 'opportunity' as const,
        title: 'Positive Press',
        description: 'Featured in TechCrunch',
        impact: { user_growth_rate: 5, valuation: 50000 },
      },
      {
        type: 'crisis' as const,
        title: 'Key Employee Leaving',
        description: 'A senior team member resigned',
        impact: { team_morale: -20, product_quality: -10 },
      },
    ]

    const event = events[Math.floor(Math.random() * events.length)]
    this.addEvent(event)
    this.applyEventImpact(event.impact)
  }

  private addEvent(event: Omit<SimulationEvent, 'id' | 'timestamp' | 'day'>): void {
    const fullEvent: SimulationEvent = {
      ...event,
      id: this.generateId(),
      timestamp: Date.now(),
      day: this.state.currentDay,
    }
    this.state.eventHistory.push(fullEvent)
  }

  private applyEventImpact(impact: Partial<StartupMetrics>): void {
    Object.entries(impact).forEach(([key, value]) => {
      const metricKey = key as keyof StartupMetrics
      const currentValue = this.state.metrics[metricKey] as number
      const newValue = currentValue + (value as number)
      this.updateMetric(metricKey, Math.max(0, newValue) as any)
    })
  }

  private triggerGameOver(reason: string): void {
    this.stop()
    this.addEvent({
      type: 'crisis',
      title: 'Game Over',
      description: reason,
      impact: {},
    })
  }

  // Decision processing
  processDecision(type: DecisionType, params: any): void {
    // This will be expanded in DecisionEngine
    switch (type) {
      case 'hire':
        this.processHire(params)
        break
      case 'marketing_campaign':
        this.processMarketing(params)
        break
      case 'build_feature':
        this.processBuildFeature(params)
        break
      // Add more decision types...
    }
  }

  private processHire(params: { role: string; salary: number }): void {
    this.updateMetric('team_size', this.state.metrics.team_size + 1)
    this.updateMetric('burn_rate', this.state.metrics.burn_rate + params.salary)
    this.addEvent({
      type: 'decision',
      title: 'New Hire',
      description: `Hired a ${params.role}`,
      impact: { team_size: 1, burn_rate: params.salary },
    })
  }

  private processMarketing(params: { budget: number }): void {
    const userGain = Math.floor((params.budget / 10) * (1 + Math.random()))
    this.updateMetric('user_count', this.state.metrics.user_count + userGain)
    this.addEvent({
      type: 'decision',
      title: 'Marketing Campaign',
      description: `Spent $${params.budget} on marketing`,
      impact: { user_count: userGain },
    })
  }

  private processBuildFeature(params: { name: string }): void {
    this.updateMetric('product_quality', Math.min(100, this.state.metrics.product_quality + 10))
    this.addEvent({
      type: 'decision',
      title: 'New Feature',
      description: `Built ${params.name}`,
      impact: { product_quality: 10 },
    })
  }

  // Milestone checking
  checkMilestones(): void {
    const milestones = [
      { threshold: 100, title: 'First 100 Users', achieved: this.state.metrics.user_count >= 100 },
      { threshold: 1000, title: 'First 1,000 Users', achieved: this.state.metrics.user_count >= 1000 },
      { threshold: 10000, title: 'First $10k MRR', achieved: this.state.metrics.mrr >= 10000 },
      { threshold: 1000000, title: 'First $1M Valuation', achieved: this.state.metrics.valuation >= 1000000 },
    ]

    milestones.forEach((milestone) => {
      if (milestone.achieved && !this.hasMilestone(milestone.title)) {
        this.addEvent({
          type: 'milestone',
          title: milestone.title,
          description: `Congratulations! You've reached: ${milestone.title}`,
          impact: { team_morale: 15 },
        })
      }
    })
  }

  private hasMilestone(title: string): boolean {
    return this.state.eventHistory.some((e) => e.type === 'milestone' && e.title === title)
  }
}
