/**
 * Daily Challenge Engine
 * Generates rotating daily challenges and tracks player progress
 */

import type {
  Challenge,
  ChallengeProgress,
  PlayerChallengeStats,
  DailyChallengeSet,
  ChallengeDifficulty,
  ChallengeTemplate,
} from '@/lib/types/challenge.types'

/**
 * Challenge Templates - Used to generate daily challenges
 */
const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // Easy Challenges (Daily engagement)
  {
    id: 'revenue-rookie',
    type: 'metric-goal',
    difficulty: 'easy',
    title: 'Revenue Rookie',
    description: 'Reach $5,000 in monthly recurring revenue',
    icon: '💰',
    requirements: {
      metric: 'mrr',
      targetValue: 5000,
      operator: 'gte'
    },
    baseRewards: { xp: 100, coins: 50 },
    skills: ['financial'],
    weight: 10
  },
  {
    id: 'decision-maker',
    type: 'decision-streak',
    difficulty: 'easy',
    title: 'Decision Maker',
    description: 'Make 5 strategic decisions today',
    icon: '🎯',
    requirements: {
      count: 5
    },
    baseRewards: { xp: 80, coins: 40 },
    skills: ['leadership'],
    weight: 15
  },
  {
    id: 'team-builder',
    type: 'metric-goal',
    difficulty: 'easy',
    title: 'Team Builder',
    description: 'Grow your team to 10 employees',
    icon: '👥',
    requirements: {
      metric: 'teamSize',
      targetValue: 10,
      operator: 'gte'
    },
    baseRewards: { xp: 120, coins: 60 },
    skills: ['leadership', 'operations'],
    weight: 10
  },
  {
    id: 'advisor-network',
    type: 'advisor-wisdom',
    difficulty: 'easy',
    title: 'Advisor Network',
    description: 'Consult with 3 different advisors',
    icon: '🧠',
    requirements: {
      advisorCount: 3,
      minQuestionsPerAdvisor: 1
    },
    baseRewards: { xp: 100, coins: 50 },
    weight: 12
  },

  // Medium Challenges
  {
    id: 'growth-hacker',
    type: 'growth-rate',
    difficulty: 'medium',
    title: 'Growth Hacker',
    description: 'Achieve 20% user growth rate for 7 days',
    icon: '📈',
    requirements: {
      metric: 'userGrowthRate',
      targetRate: 20,
      duration: 7
    },
    baseRewards: { xp: 250, coins: 150 },
    skills: ['marketing', 'growth-hacking'],
    weight: 8
  },
  {
    id: 'efficiency-expert',
    type: 'efficiency',
    difficulty: 'medium',
    title: 'Efficiency Expert',
    description: 'Reach $10,000 revenue per employee',
    icon: '⚡',
    requirements: {
      numeratorMetric: 'mrr',
      denominatorMetric: 'teamSize',
      targetRatio: 10000
    },
    baseRewards: { xp: 200, coins: 120 },
    skills: ['operations', 'financial'],
    weight: 7
  },
  {
    id: 'morale-master',
    type: 'survival',
    difficulty: 'medium',
    title: 'Morale Master',
    description: 'Keep team morale above 80% for 14 days',
    icon: '😊',
    requirements: {
      metric: 'teamMorale',
      minimumValue: 80,
      duration: 14
    },
    baseRewards: { xp: 300, coins: 180 },
    skills: ['leadership'],
    weight: 8
  },
  {
    id: 'skill-specialist',
    type: 'skill-focus',
    difficulty: 'medium',
    title: 'Skill Specialist',
    description: 'Earn 200 points in any single skill',
    icon: '🎓',
    requirements: {
      skill: 'leadership' as any, // Will be randomized
      targetPoints: 200
    },
    baseRewards: { xp: 250, coins: 150 },
    weight: 9
  },

  // Hard Challenges
  {
    id: 'unicorn-chase',
    type: 'metric-goal',
    difficulty: 'hard',
    title: 'Unicorn Chase',
    description: 'Reach a valuation of $1 billion',
    icon: '🦄',
    requirements: {
      metric: 'valuation',
      targetValue: 1000000000,
      operator: 'gte'
    },
    baseRewards: { xp: 500, coins: 300, achievements: ['unicorn-status'] },
    skills: ['strategy', 'fundraising'],
    weight: 3
  },
  {
    id: 'perfect-execution',
    type: 'scenario-perfect',
    difficulty: 'hard',
    title: 'Perfect Execution',
    description: 'Complete any scenario with 95+ score',
    icon: '💎',
    requirements: {
      scenarioId: 'any',
      minimumScore: 95
    },
    baseRewards: { xp: 400, coins: 250 },
    weight: 5
  },
  {
    id: 'champion',
    type: 'competition-win',
    difficulty: 'hard',
    title: 'Champion',
    description: 'Win a head-to-head competition',
    icon: '🏆',
    requirements: {
      matchType: 'head-to-head'
    },
    baseRewards: { xp: 350, coins: 200 },
    skills: ['strategy'],
    weight: 6
  },
  {
    id: 'lightning-growth',
    type: 'rapid-growth',
    difficulty: 'hard',
    title: 'Lightning Growth',
    description: 'Reach 50,000 users in under 30 minutes',
    icon: '⚡',
    requirements: {
      metric: 'userCount',
      targetValue: 50000,
      maxTime: 30
    },
    baseRewards: { xp: 450, coins: 280 },
    skills: ['growth-hacking', 'marketing'],
    weight: 4
  },

  // Expert Challenges
  {
    id: 'legendary-founder',
    type: 'decision-streak',
    difficulty: 'expert',
    title: 'Legendary Founder',
    description: 'Make 20 decisions with 90% success rate',
    icon: '👑',
    requirements: {
      count: 20,
      successRate: 90
    },
    baseRewards: { xp: 1000, coins: 600, achievements: ['legendary-founder'] },
    skills: ['leadership', 'strategy'],
    weight: 2
  },
  {
    id: 'market-domination',
    type: 'metric-goal',
    difficulty: 'expert',
    title: 'Market Domination',
    description: 'Capture 50% market share',
    icon: '👑',
    requirements: {
      metric: 'marketShare',
      targetValue: 50,
      operator: 'gte'
    },
    baseRewards: { xp: 800, coins: 500, achievements: ['market-leader'] },
    skills: ['strategy', 'marketing'],
    weight: 2
  },
  {
    id: 'impossible-survival',
    type: 'survival',
    difficulty: 'expert',
    title: 'Impossible Survival',
    description: 'Survive 30 days with runway under 2 months',
    icon: '🔥',
    requirements: {
      metric: 'runway',
      minimumValue: 0.5,
      duration: 30
    },
    baseRewards: { xp: 900, coins: 550, achievements: ['survivor'] },
    skills: ['crisis-management', 'financial'],
    weight: 1
  }
]

export class DailyChallengeEngine {
  private stats: PlayerChallengeStats
  private activeProgress: Map<string, ChallengeProgress> = new Map()

  constructor(stats?: PlayerChallengeStats) {
    this.stats = stats || {
      userId: '',
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      completionRate: 0,
      totalXpEarned: 0,
      totalCoinsEarned: 0
    }
  }

  /**
   * Generate daily challenge set for a specific date
   */
  generateDailyChallenges(date: Date = new Date()): DailyChallengeSet {
    const dateString = this.getDateString(date)

    // Use date as seed for deterministic random selection
    const seed = this.dateSeed(dateString)

    // Select 3 regular challenges (easy, medium, hard)
    const challenges: Challenge[] = []

    // 1 Easy challenge
    challenges.push(this.selectChallenge('easy', seed + 1, date))

    // 1 Medium challenge
    challenges.push(this.selectChallenge('medium', seed + 2, date))

    // 1 Hard challenge
    challenges.push(this.selectChallenge('hard', seed + 3, date))

    // Bonus challenge (expert) - unlocked after 7-day streak
    let bonusChallenge: Challenge | undefined
    if (this.stats.currentStreak >= 7) {
      bonusChallenge = this.selectChallenge('expert', seed + 4, date)
    }

    return {
      date: dateString,
      challenges,
      bonusChallenge
    }
  }

  /**
   * Select a challenge of specific difficulty
   */
  private selectChallenge(
    difficulty: ChallengeDifficulty,
    seed: number,
    date: Date
  ): Challenge {
    const templates = CHALLENGE_TEMPLATES.filter(t => t.difficulty === difficulty)
    const selected = this.weightedRandom(templates, seed)

    const expiresAt = new Date(date)
    expiresAt.setHours(23, 59, 59, 999) // End of day

    // Calculate rewards with streak multiplier
    const streakMultiplier = 1 + (this.stats.currentStreak * 0.1)

    return {
      id: `${selected.id}-${this.getDateString(date)}`,
      type: selected.type,
      difficulty: selected.difficulty,
      title: selected.title,
      description: selected.description,
      icon: selected.icon,
      requirements: { ...selected.requirements, type: selected.type } as any,
      expiresAt,
      estimatedTime: this.estimateTime(selected.difficulty),
      rewards: {
        ...selected.baseRewards,
        xp: Math.round(selected.baseRewards.xp * streakMultiplier),
        coins: selected.baseRewards.coins ? Math.round(selected.baseRewards.coins * streakMultiplier) : undefined,
        bonusMultiplier: streakMultiplier
      },
      skills: selected.skills,
      category: 'daily'
    }
  }

  /**
   * Weighted random selection
   */
  private weightedRandom(templates: ChallengeTemplate[], seed: number): ChallengeTemplate {
    const totalWeight = templates.reduce((sum, t) => sum + t.weight, 0)
    const random = (seed % totalWeight)

    let cumulative = 0
    for (const template of templates) {
      cumulative += template.weight
      if (random < cumulative) {
        return template
      }
    }

    return templates[templates.length - 1]
  }

  /**
   * Generate deterministic seed from date string
   */
  private dateSeed(dateString: string): number {
    let hash = 0
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Get date string in YYYY-MM-DD format
   */
  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  /**
   * Estimate time based on difficulty
   */
  private estimateTime(difficulty: ChallengeDifficulty): number {
    switch (difficulty) {
      case 'easy': return 10
      case 'medium': return 20
      case 'hard': return 45
      case 'expert': return 90
    }
  }

  /**
   * Start tracking a challenge
   */
  startChallenge(challengeId: string): ChallengeProgress {
    const progress: ChallengeProgress = {
      challengeId,
      userId: this.stats.userId,
      status: 'in-progress',
      progress: 0,
      startedAt: new Date()
    }

    this.activeProgress.set(challengeId, progress)
    return progress
  }

  /**
   * Update challenge progress
   */
  updateProgress(challengeId: string, currentValue: any): ChallengeProgress {
    const progress = this.activeProgress.get(challengeId)
    if (!progress) {
      throw new Error(`Challenge ${challengeId} not started`)
    }

    progress.currentValue = currentValue
    // Progress calculation would be based on challenge type
    // This is simplified - real implementation would check requirements

    return progress
  }

  /**
   * Complete a challenge
   */
  completeChallenge(challengeId: string, challenge: Challenge): {
    progress: ChallengeProgress
    streakBonus: number
    newStreak: number
  } {
    const progress = this.activeProgress.get(challengeId) || this.startChallenge(challengeId)

    progress.status = 'completed'
    progress.completedAt = new Date()
    progress.progress = 100

    // Update stats
    this.stats.totalCompleted++
    this.stats.totalXpEarned += challenge.rewards.xp
    this.stats.totalCoinsEarned += challenge.rewards.coins || 0

    // Update streak
    const today = this.getDateString(new Date())
    const lastCompleted = this.stats.lastCompletedDate
      ? this.getDateString(this.stats.lastCompletedDate)
      : null

    if (!lastCompleted || this.isConsecutiveDay(lastCompleted, today)) {
      this.stats.currentStreak++
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak
      }
    } else {
      this.stats.currentStreak = 1
    }

    this.stats.lastCompletedDate = new Date()

    const streakBonus = Math.floor(challenge.rewards.xp * (this.stats.currentStreak * 0.1))

    return {
      progress,
      streakBonus,
      newStreak: this.stats.currentStreak
    }
  }

  /**
   * Check if dates are consecutive days
   */
  private isConsecutiveDay(dateStr1: string, dateStr2: string): boolean {
    const date1 = new Date(dateStr1)
    const date2 = new Date(dateStr2)
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
  }

  /**
   * Expire old challenges
   */
  expireOldChallenges(challenges: Challenge[]): void {
    const now = new Date()

    challenges.forEach(challenge => {
      if (challenge.expiresAt < now) {
        const progress = this.activeProgress.get(challenge.id)
        if (progress && progress.status === 'in-progress') {
          progress.status = 'expired'

          // Break streak if challenge wasn't completed
          this.stats.currentStreak = 0
        }
      }
    })
  }

  /**
   * Get player stats
   */
  getStats(): PlayerChallengeStats {
    return { ...this.stats }
  }

  /**
   * Get active progress
   */
  getProgress(challengeId: string): ChallengeProgress | undefined {
    return this.activeProgress.get(challengeId)
  }

  /**
   * Get all active progress
   */
  getAllProgress(): ChallengeProgress[] {
    return Array.from(this.activeProgress.values())
  }
}
