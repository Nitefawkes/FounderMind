/**
 * Scenario Engine Types
 * Defines the structure for educational scenarios and case studies
 */

export type ScenarioCategory =
  | 'famous-startup'
  | 'crisis-management'
  | 'growth-strategy'
  | 'fundraising'
  | 'product-launch'
  | 'team-building'
  | 'pivot-decision'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type SkillTag =
  | 'leadership'
  | 'technical'
  | 'financial'
  | 'marketing'
  | 'product'
  | 'strategy'
  | 'operations'
  | 'fundraising'
  | 'growth-hacking'
  | 'crisis-management'

export interface ScenarioDecision {
  id: string
  prompt: string
  description: string
  options: ScenarioOption[]
  timeLimit?: number // seconds, optional time pressure
  context?: {
    metrics?: Partial<ScenarioMetrics>
    additionalInfo?: string
  }
}

export interface ScenarioOption {
  id: string
  label: string
  description: string
  outcomes: ScenarioOutcome
  analysis: {
    reasoning: string
    realWorldExample?: string
    advisorCommentary?: {
      advisor: 'CEO' | 'CTO' | 'CFO' | 'CMO' | 'Investor'
      comment: string
    }[]
  }
}

export interface ScenarioOutcome {
  immediate: {
    metricChanges: Partial<ScenarioMetrics>
    eventDescription: string
  }
  longTerm?: {
    metricChanges: Partial<ScenarioMetrics>
    eventDescription: string
    delay: number // days
  }
  nextDecisionId?: string // for branching scenarios
  skillPoints?: {
    skill: SkillTag
    points: number
  }[]
}

export interface ScenarioMetrics {
  cash: number
  runway: number
  mrr: number
  userCount: number
  userGrowthRate: number
  teamSize: number
  teamMorale: number
  productQuality: number
  marketShare: number
  brandReputation: number
  investorConfidence: number
}

export interface Scenario {
  id: string
  title: string
  category: ScenarioCategory
  difficulty: DifficultyLevel
  estimatedTime: number // minutes
  description: string
  learningObjectives: string[]
  skills: SkillTag[]

  // Story context
  backstory: string
  realWorldInspiration?: {
    company: string
    founder: string
    year: number
    outcome: string
  }

  // Scenario flow
  initialState: ScenarioMetrics
  decisions: ScenarioDecision[]

  // Success criteria
  successCriteria: {
    metric: keyof ScenarioMetrics
    operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq'
    value: number
  }[]

  // Rewards
  rewards: {
    xp: number
    achievements?: string[]
    unlocks?: string[] // unlock other scenarios
  }
}

export interface ScenarioProgress {
  scenarioId: string
  userId: string
  status: 'not-started' | 'in-progress' | 'completed' | 'failed'
  currentDecisionIndex: number
  decisionHistory: {
    decisionId: string
    optionId: string
    timestamp: Date
  }[]
  currentMetrics: ScenarioMetrics
  startedAt?: Date
  completedAt?: Date
  score?: number // 0-100 based on success criteria
  skillsEarned?: {
    skill: SkillTag
    points: number
  }[]
}

export interface SkillTree {
  skills: SkillNode[]
}

export interface SkillNode {
  id: string
  skill: SkillTag
  name: string
  description: string
  icon: string
  maxLevel: number
  prerequisites?: string[] // other skill node IDs
  unlocks: {
    scenarios?: string[]
    features?: string[]
    advisorInsights?: string[]
  }
}

export interface PlayerSkills {
  userId: string
  skills: {
    [key in SkillTag]?: {
      level: number
      points: number
      pointsToNextLevel: number
    }
  }
  totalSkillPoints: number
}

export interface CaseStudy {
  scenarioId: string
  analysis: {
    playerDecisions: {
      decisionId: string
      optionChosen: string
      actualChoice?: string // what the real company did
      outcome: 'optimal' | 'suboptimal' | 'alternative'
    }[]
    overallPerformance: {
      score: number
      grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
      comparison: string
    }
    keyLearnings: string[]
    recommendedResources?: {
      title: string
      url: string
      type: 'article' | 'video' | 'book' | 'podcast'
    }[]
  }
}
