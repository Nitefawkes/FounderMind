import type { DecisionType, StartupMetrics, MarketConditions } from '@/lib/types/database.types'

export interface Decision {
  type: DecisionType
  title: string
  description: string
  options: DecisionOption[]
  context: DecisionContext
}

export interface DecisionOption {
  id: string
  label: string
  description: string
  cost?: number
  timeRequired?: number // in days
  riskLevel: 'low' | 'medium' | 'high'
  expectedOutcome: Partial<StartupMetrics>
}

export interface DecisionContext {
  currentMetrics: StartupMetrics
  market: MarketConditions
  availableCapital: number
  dayInSimulation: number
}

export interface DecisionOutcome {
  success: boolean
  actualOutcome: Partial<StartupMetrics>
  message: string
  consequences: string[]
  xpGained: number
}

export class DecisionEngine {
  private context: DecisionContext

  constructor(context: DecisionContext) {
    this.context = context
  }

  updateContext(context: Partial<DecisionContext>): void {
    this.context = { ...this.context, ...context }
  }

  generateDecisionOptions(type: DecisionType): Decision {
    switch (type) {
      case 'hire':
        return this.generateHireDecision()
      case 'fire':
        return this.generateFireDecision()
      case 'pivot':
        return this.generatePivotDecision()
      case 'fundraise':
        return this.generateFundraiseDecision()
      case 'build_feature':
        return this.generateBuildFeatureDecision()
      case 'marketing_campaign':
        return this.generateMarketingDecision()
      case 'price_change':
        return this.generatePriceChangeDecision()
      case 'partnership':
        return this.generatePartnershipDecision()
      default:
        throw new Error(`Unknown decision type: ${type}`)
    }
  }

  private generateHireDecision(): Decision {
    return {
      type: 'hire',
      title: 'Hiring Decision',
      description: 'Who should you hire next?',
      context: this.context,
      options: [
        {
          id: 'hire_engineer',
          label: 'Senior Engineer',
          description: 'Boost product quality and development speed',
          cost: 12000,
          timeRequired: 30,
          riskLevel: 'low',
          expectedOutcome: {
            product_quality: 15,
            burn_rate: 12000,
            team_size: 1,
          },
        },
        {
          id: 'hire_sales',
          label: 'Sales Rep',
          description: 'Accelerate revenue growth',
          cost: 8000,
          timeRequired: 30,
          riskLevel: 'medium',
          expectedOutcome: {
            mrr: 5000,
            burn_rate: 8000,
            team_size: 1,
          },
        },
        {
          id: 'hire_marketer',
          label: 'Growth Marketer',
          description: 'Increase user acquisition',
          cost: 9000,
          timeRequired: 30,
          riskLevel: 'medium',
          expectedOutcome: {
            user_growth_rate: 10,
            burn_rate: 9000,
            team_size: 1,
          },
        },
        {
          id: 'hire_designer',
          label: 'Product Designer',
          description: 'Improve user experience',
          cost: 10000,
          timeRequired: 30,
          riskLevel: 'low',
          expectedOutcome: {
            product_quality: 10,
            customer_satisfaction: 15,
            burn_rate: 10000,
            team_size: 1,
          },
        },
      ],
    }
  }

  private generateFireDecision(): Decision {
    return {
      type: 'fire',
      title: 'Difficult Decision',
      description: 'Team member not performing. What do you do?',
      context: this.context,
      options: [
        {
          id: 'fire_immediately',
          label: 'Let them go',
          description: 'Reduce burn rate but hurt morale',
          cost: 0,
          riskLevel: 'high',
          expectedOutcome: {
            burn_rate: -8000,
            team_morale: -20,
            team_size: -1,
          },
        },
        {
          id: 'performance_plan',
          label: 'Performance improvement plan',
          description: 'Give them a chance, but takes time',
          timeRequired: 60,
          riskLevel: 'medium',
          expectedOutcome: {
            team_morale: -5,
          },
        },
        {
          id: 'reassign',
          label: 'Reassign to different role',
          description: 'Keep them but in better-fit position',
          riskLevel: 'low',
          expectedOutcome: {
            team_morale: 5,
          },
        },
      ],
    }
  }

  private generatePivotDecision(): Decision {
    return {
      type: 'pivot',
      title: 'Pivot or Persevere?',
      description: 'Current strategy not working. Time to pivot?',
      context: this.context,
      options: [
        {
          id: 'full_pivot',
          label: 'Complete Pivot',
          description: 'Change entire business model',
          cost: 20000,
          timeRequired: 90,
          riskLevel: 'high',
          expectedOutcome: {
            user_count: -this.context.currentMetrics.user_count * 0.5,
            product_quality: -20,
            team_morale: -15,
            user_growth_rate: 20, // Potential for high growth
          },
        },
        {
          id: 'minor_pivot',
          label: 'Minor Pivot',
          description: 'Adjust target market or pricing',
          cost: 5000,
          timeRequired: 30,
          riskLevel: 'medium',
          expectedOutcome: {
            user_growth_rate: 10,
            mrr: 2000,
          },
        },
        {
          id: 'persevere',
          label: 'Stay the Course',
          description: 'Keep executing current plan',
          riskLevel: 'low',
          expectedOutcome: {
            team_morale: 5,
          },
        },
      ],
    }
  }

  private generateFundraiseDecision(): Decision {
    return {
      type: 'fundraise',
      title: 'Fundraising Round',
      description: 'How much should you raise?',
      context: this.context,
      options: [
        {
          id: 'angel_round',
          label: 'Angel Round ($100k)',
          description: 'Quick cash, minimal dilution',
          cost: 0,
          timeRequired: 30,
          riskLevel: 'low',
          expectedOutcome: {
            valuation: 100000,
            runway: 10,
          },
        },
        {
          id: 'seed_round',
          label: 'Seed Round ($500k)',
          description: 'Significant runway, 15-20% dilution',
          cost: 0,
          timeRequired: 60,
          riskLevel: 'medium',
          expectedOutcome: {
            valuation: 500000,
            runway: 18,
          },
        },
        {
          id: 'series_a',
          label: 'Series A ($2M+)',
          description: 'Major capital, but need strong metrics',
          cost: 0,
          timeRequired: 90,
          riskLevel: 'high',
          expectedOutcome: {
            valuation: 2000000,
            runway: 24,
          },
        },
        {
          id: 'bootstrap',
          label: 'Stay Bootstrapped',
          description: 'No dilution, maintain control',
          riskLevel: 'medium',
          expectedOutcome: {
            team_morale: 10, // Team likes independence
          },
        },
      ],
    }
  }

  private generateBuildFeatureDecision(): Decision {
    return {
      type: 'build_feature',
      title: 'Product Roadmap',
      description: 'What should the team build next?',
      context: this.context,
      options: [
        {
          id: 'requested_feature',
          label: 'Customer-Requested Feature',
          description: 'Build what users are asking for',
          timeRequired: 30,
          riskLevel: 'low',
          expectedOutcome: {
            customer_satisfaction: 20,
            product_quality: 10,
          },
        },
        {
          id: 'innovative_feature',
          label: 'Innovative Feature',
          description: 'Build something groundbreaking',
          timeRequired: 60,
          riskLevel: 'high',
          expectedOutcome: {
            product_quality: 25,
            user_growth_rate: 15,
          },
        },
        {
          id: 'technical_debt',
          label: 'Fix Technical Debt',
          description: 'Improve stability and performance',
          timeRequired: 45,
          riskLevel: 'low',
          expectedOutcome: {
            product_quality: 15,
            team_morale: 10,
          },
        },
      ],
    }
  }

  private generateMarketingDecision(): Decision {
    return {
      type: 'marketing_campaign',
      title: 'Marketing Strategy',
      description: 'How should you acquire users?',
      context: this.context,
      options: [
        {
          id: 'paid_ads',
          label: 'Paid Advertising',
          description: 'Fast results but expensive',
          cost: 10000,
          timeRequired: 7,
          riskLevel: 'medium',
          expectedOutcome: {
            user_count: 500,
            burn_rate: 10000,
          },
        },
        {
          id: 'content_marketing',
          label: 'Content Marketing',
          description: 'Slow burn but sustainable',
          cost: 2000,
          timeRequired: 90,
          riskLevel: 'low',
          expectedOutcome: {
            user_growth_rate: 8,
            burn_rate: 2000,
          },
        },
        {
          id: 'viral_campaign',
          label: 'Viral Campaign',
          description: 'High risk, high reward',
          cost: 5000,
          timeRequired: 14,
          riskLevel: 'high',
          expectedOutcome: {
            user_count: 2000,
            user_growth_rate: 20,
          },
        },
        {
          id: 'partnerships',
          label: 'Partnership Marketing',
          description: 'Leverage other brands',
          cost: 1000,
          timeRequired: 30,
          riskLevel: 'medium',
          expectedOutcome: {
            user_count: 300,
            user_growth_rate: 5,
          },
        },
      ],
    }
  }

  private generatePriceChangeDecision(): Decision {
    const currentMRR = this.context.currentMetrics.mrr

    return {
      type: 'price_change',
      title: 'Pricing Strategy',
      description: 'Should you adjust your pricing?',
      context: this.context,
      options: [
        {
          id: 'increase_price',
          label: 'Increase Prices 20%',
          description: 'More revenue but may lose users',
          riskLevel: 'high',
          expectedOutcome: {
            mrr: currentMRR * 1.15, // Net 15% increase (lose some customers)
            user_count: -this.context.currentMetrics.user_count * 0.1,
          },
        },
        {
          id: 'decrease_price',
          label: 'Decrease Prices 20%',
          description: 'Gain market share, lose margin',
          riskLevel: 'medium',
          expectedOutcome: {
            mrr: currentMRR * 0.9, // Net 10% decrease initially
            user_growth_rate: 15,
          },
        },
        {
          id: 'freemium',
          label: 'Introduce Freemium Tier',
          description: 'Free tier with premium upsells',
          timeRequired: 30,
          riskLevel: 'medium',
          expectedOutcome: {
            user_growth_rate: 25,
            mrr: currentMRR * 0.8, // Initial revenue drop
          },
        },
      ],
    }
  }

  private generatePartnershipDecision(): Decision {
    return {
      type: 'partnership',
      title: 'Partnership Opportunity',
      description: 'A larger company wants to partner',
      context: this.context,
      options: [
        {
          id: 'exclusive_partnership',
          label: 'Exclusive Partnership',
          description: 'Big upfront payment but limits future options',
          cost: -50000, // Negative cost = revenue
          riskLevel: 'high',
          expectedOutcome: {
            valuation: 50000,
            user_growth_rate: -5, // Limits growth
          },
        },
        {
          id: 'non_exclusive',
          label: 'Non-Exclusive Partnership',
          description: 'Balanced approach',
          cost: -10000,
          riskLevel: 'medium',
          expectedOutcome: {
            valuation: 10000,
            user_growth_rate: 5,
          },
        },
        {
          id: 'decline',
          label: 'Decline',
          description: 'Maintain independence',
          riskLevel: 'low',
          expectedOutcome: {
            team_morale: 5,
          },
        },
      ],
    }
  }

  executeDecision(decision: Decision, chosenOptionId: string): DecisionOutcome {
    const option = decision.options.find((opt) => opt.id === chosenOptionId)
    if (!option) {
      throw new Error(`Invalid option: ${chosenOptionId}`)
    }

    // Check if player can afford it
    if (option.cost && option.cost > this.context.availableCapital) {
      return {
        success: false,
        actualOutcome: {},
        message: 'Not enough capital to execute this decision',
        consequences: ['Decision cancelled due to insufficient funds'],
        xpGained: 0,
      }
    }

    // Calculate actual outcome with randomness
    const actualOutcome = this.calculateActualOutcome(option, decision.type)
    const success = this.determineSuccess(option)

    const consequences = this.generateConsequences(option, success, decision.type)
    const xpGained = this.calculateXP(option, success)

    return {
      success,
      actualOutcome,
      message: success
        ? `Successfully executed: ${option.label}`
        : `${option.label} didn't go as planned`,
      consequences,
      xpGained,
    }
  }

  private calculateActualOutcome(
    option: DecisionOption,
    decisionType: DecisionType
  ): Partial<StartupMetrics> {
    const outcome: Partial<StartupMetrics> = {}

    // Apply expected outcome with variance based on risk
    const varianceMultiplier = {
      low: { min: 0.8, max: 1.2 },
      medium: { min: 0.5, max: 1.5 },
      high: { min: 0.2, max: 2.0 },
    }

    const variance = varianceMultiplier[option.riskLevel]

    Object.entries(option.expectedOutcome).forEach(([key, value]) => {
      const metricKey = key as keyof StartupMetrics
      const randomMultiplier = variance.min + Math.random() * (variance.max - variance.min)
      const actualValue = (value as number) * randomMultiplier

      outcome[metricKey] = actualValue as any
    })

    return outcome
  }

  private determineSuccess(option: DecisionOption): boolean {
    const successRates = {
      low: 0.9, // 90% success
      medium: 0.7, // 70% success
      high: 0.5, // 50% success
    }

    return Math.random() < successRates[option.riskLevel]
  }

  private generateConsequences(
    option: DecisionOption,
    success: boolean,
    type: DecisionType
  ): string[] {
    const consequences: string[] = []

    if (!success) {
      consequences.push('The decision did not yield expected results')

      // Type-specific failure consequences
      if (type === 'hire') {
        consequences.push('The new hire did not work out and left after a month')
      } else if (type === 'marketing_campaign') {
        consequences.push('The campaign did not resonate with the target audience')
      } else if (type === 'pivot') {
        consequences.push('The pivot confused existing customers')
      }
    } else {
      // Success consequences
      if (type === 'hire' && option.id === 'hire_engineer') {
        consequences.push('Team velocity increased significantly')
      } else if (type === 'fundraise') {
        consequences.push('Investors are excited about your vision')
      } else if (type === 'build_feature') {
        consequences.push('Users are loving the new feature')
      }
    }

    return consequences
  }

  private calculateXP(option: DecisionOption, success: boolean): number {
    const baseXP = {
      low: 10,
      medium: 25,
      high: 50,
    }

    const xp = baseXP[option.riskLevel]
    return success ? xp : Math.floor(xp * 0.5) // Half XP for failures
  }
}
