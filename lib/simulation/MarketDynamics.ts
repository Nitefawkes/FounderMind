import type { MarketConditions, StartupMetrics } from '@/lib/types/database.types'

export interface Competitor {
  id: string
  name: string
  strategy: 'aggressive' | 'conservative' | 'copycat' | 'innovator'
  marketShare: number
  metrics: Partial<StartupMetrics>
}

export interface MarketEvent {
  id: string
  type: 'trend_shift' | 'economic_change' | 'regulation' | 'new_competitor' | 'acquisition'
  severity: 'minor' | 'moderate' | 'major'
  description: string
  impact: Partial<MarketConditions>
}

export class MarketDynamics {
  private market: MarketConditions
  private competitors: Competitor[]
  private playerMarketShare: number = 0

  constructor(market: MarketConditions) {
    this.market = market
    this.competitors = this.generateCompetitors()
  }

  private generateCompetitors(): Competitor[] {
    const competitorCount = Math.floor(this.market.competition_level / 20) + 2 // 2-6 competitors
    const competitors: Competitor[] = []

    const strategies: Array<'aggressive' | 'conservative' | 'copycat' | 'innovator'> = [
      'aggressive',
      'conservative',
      'copycat',
      'innovator',
    ]

    const names = [
      'TechFlow',
      'InnovateCo',
      'MarketLeader',
      'GrowthLabs',
      'ScaleUp Inc',
      'VentureMax',
      'StartupPro',
      'DisruptHub',
    ]

    for (let i = 0; i < competitorCount; i++) {
      competitors.push({
        id: `comp_${i}`,
        name: names[i % names.length],
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
        marketShare: 5 + Math.random() * 15, // 5-20% each
        metrics: {
          user_count: Math.floor(10000 + Math.random() * 100000),
          mrr: Math.floor(50000 + Math.random() * 200000),
          team_size: Math.floor(10 + Math.random() * 50),
          product_quality: 60 + Math.random() * 30,
        },
      })
    }

    return competitors
  }

  getMarket(): MarketConditions {
    return { ...this.market }
  }

  getCompetitors(): Competitor[] {
    return [...this.competitors]
  }

  updatePlayerMarketShare(playerMetrics: StartupMetrics): void {
    // Calculate total market users
    const totalMarketUsers = this.competitors.reduce(
      (sum, comp) => sum + (comp.metrics.user_count || 0),
      0
    ) + playerMetrics.user_count

    // Calculate player's market share
    this.playerMarketShare = totalMarketUsers > 0
      ? (playerMetrics.user_count / totalMarketUsers) * 100
      : 0
  }

  simulateCompetitorActions(playerMetrics: StartupMetrics): MarketEvent[] {
    const events: MarketEvent[] = []

    this.competitors.forEach((competitor) => {
      switch (competitor.strategy) {
        case 'aggressive':
          // Aggressive competitors grow fast and may try to acquire others
          if (Math.random() > 0.7) {
            competitor.marketShare += 1
            events.push({
              id: `event_${Date.now()}`,
              type: 'new_competitor',
              severity: 'moderate',
              description: `${competitor.name} launched aggressive marketing campaign`,
              impact: { competition_level: 5 },
            })
          }
          break

        case 'copycat':
          // Copycats mimic the player if they're doing well
          if (playerMetrics.user_growth_rate > 10) {
            competitor.metrics.user_count = (competitor.metrics.user_count || 0) * 1.1
          }
          break

        case 'innovator':
          // Innovators randomly boost product quality
          if (Math.random() > 0.8) {
            competitor.metrics.product_quality = Math.min(
              100,
              (competitor.metrics.product_quality || 60) + 10
            )
            events.push({
              id: `event_${Date.now()}`,
              type: 'trend_shift',
              severity: 'minor',
              description: `${competitor.name} launched innovative feature`,
              impact: { competition_level: 3 },
            })
          }
          break

        case 'conservative':
          // Conservative competitors grow slowly but steadily
          competitor.metrics.user_count = (competitor.metrics.user_count || 0) * 1.02
          break
      }
    })

    return events
  }

  processEconomicCycle(month: number): MarketEvent[] {
    const events: MarketEvent[] = []

    // Economic cycle changes every 12-24 months
    if (month % 18 === 0 && Math.random() > 0.5) {
      const cycles: Array<'boom' | 'normal' | 'recession'> = ['boom', 'normal', 'recession']
      const currentIndex = cycles.indexOf(this.market.economic_cycle)
      const newCycle = cycles[(currentIndex + 1) % cycles.length]

      this.market.economic_cycle = newCycle

      events.push({
        id: `cycle_${Date.now()}`,
        type: 'economic_change',
        severity: 'major',
        description: `Economic cycle changed to ${newCycle}`,
        impact: {
          economic_cycle: newCycle,
          growth_rate: newCycle === 'boom' ? 15 : newCycle === 'recession' ? 2 : 8,
        },
      })
    }

    return events
  }

  calculateMarketImpact(playerMetrics: StartupMetrics): Partial<StartupMetrics> {
    const impact: Partial<StartupMetrics> = {}

    // Economic cycle affects growth
    switch (this.market.economic_cycle) {
      case 'boom':
        impact.user_growth_rate = (playerMetrics.user_growth_rate || 0) * 1.2
        break
      case 'recession':
        impact.user_growth_rate = (playerMetrics.user_growth_rate || 0) * 0.8
        impact.burn_rate = playerMetrics.burn_rate * 1.1 // Costs go up
        break
      case 'normal':
        // No change
        break
    }

    // High competition reduces growth
    const competitionFactor = 1 - (this.market.competition_level / 200)
    impact.user_growth_rate = (impact.user_growth_rate || playerMetrics.user_growth_rate || 0) * competitionFactor

    return impact
  }

  triggerRandomMarketEvent(): MarketEvent | null {
    if (Math.random() > 0.1) return null // 10% chance

    const eventTypes: MarketEvent[] = [
      {
        id: `market_${Date.now()}`,
        type: 'regulation',
        severity: 'major',
        description: 'New regulations require compliance updates',
        impact: { competition_level: -5 }, // Less competition due to barriers
      },
      {
        id: `market_${Date.now()}`,
        type: 'trend_shift',
        severity: 'moderate',
        description: 'Major trend shift in the industry',
        impact: { growth_rate: this.market.growth_rate + 5 },
      },
      {
        id: `market_${Date.now()}`,
        type: 'acquisition',
        severity: 'major',
        description: 'Major acquisition in the industry',
        impact: { competition_level: -10 }, // Consolidation reduces competition
      },
      {
        id: `market_${Date.now()}`,
        type: 'new_competitor',
        severity: 'moderate',
        description: 'Well-funded competitor entered the market',
        impact: { competition_level: 15 },
      },
    ]

    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    // Apply impact to market
    Object.entries(event.impact).forEach(([key, value]) => {
      const marketKey = key as keyof MarketConditions
      if (typeof value === 'number' && typeof this.market[marketKey] === 'number') {
        (this.market[marketKey] as number) += value
      }
    })

    return event
  }

  assessCompetitivePosition(playerMetrics: StartupMetrics): {
    rank: number
    advantages: string[]
    threats: string[]
  } {
    const allEntities = [
      { name: 'Your Startup', metrics: playerMetrics },
      ...this.competitors.map(c => ({ name: c.name, metrics: c.metrics as StartupMetrics })),
    ]

    // Simple ranking by user count
    allEntities.sort((a, b) => (b.metrics.user_count || 0) - (a.metrics.user_count || 0))
    const rank = allEntities.findIndex(e => e.name === 'Your Startup') + 1

    const advantages: string[] = []
    const threats: string[] = []

    // Analyze advantages
    if (playerMetrics.product_quality > 80) {
      advantages.push('Superior product quality')
    }
    if (playerMetrics.team_morale > 80) {
      advantages.push('High team morale')
    }
    if (playerMetrics.user_growth_rate > 15) {
      advantages.push('Strong growth trajectory')
    }

    // Analyze threats
    const aggressiveCompetitors = this.competitors.filter(c => c.strategy === 'aggressive')
    if (aggressiveCompetitors.length > 0) {
      threats.push(`${aggressiveCompetitors.length} aggressive competitor(s)`)
    }
    if (this.market.competition_level > 70) {
      threats.push('Highly competitive market')
    }
    if (this.market.economic_cycle === 'recession') {
      threats.push('Economic downturn')
    }

    return { rank, advantages, threats }
  }

  getMarketInsights(): string[] {
    const insights: string[] = []

    if (this.market.growth_rate > 15) {
      insights.push('📈 Market is growing rapidly - good time to capture share')
    } else if (this.market.growth_rate < 5) {
      insights.push('📉 Market growth is slowing - focus on retention')
    }

    if (this.market.competition_level > 70) {
      insights.push('⚔️ High competition - differentiation is critical')
    } else if (this.market.competition_level < 30) {
      insights.push('🎯 Low competition - opportunity to dominate')
    }

    if (this.market.economic_cycle === 'boom') {
      insights.push('💰 Economic boom - favorable for fundraising')
    } else if (this.market.economic_cycle === 'recession') {
      insights.push('⚠️ Economic recession - focus on profitability')
    }

    return insights
  }
}
