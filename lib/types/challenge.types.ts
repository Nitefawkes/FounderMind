/**
 * Daily Challenge Types
 * Time-limited objectives to drive daily engagement
 */

import type { SkillTag } from './scenario.types'

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type ChallengeType =
  | 'metric-goal'          // Reach a specific metric value
  | 'decision-streak'      // Make N decisions in a row
  | 'growth-rate'          // Achieve X% growth rate
  | 'efficiency'           // Specific metric ratio (e.g., revenue/employee)
  | 'survival'             // Survive X days without metric dropping
  | 'advisor-wisdom'       // Get advice from all advisors
  | 'scenario-perfect'     // Complete scenario with perfect score
  | 'skill-focus'          // Earn X skill points in specific skill
  | 'competition-win'      // Win a competition match
  | 'rapid-growth'         // Fastest time to reach milestone

export interface Challenge {
  id: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  title: string
  description: string
  icon: string

  // Requirements
  requirements: ChallengeRequirement

  // Time constraints
  expiresAt: Date
  estimatedTime: number // minutes

  // Rewards
  rewards: {
    xp: number
    coins?: number
    achievements?: string[]
    unlocks?: string[]
    bonusMultiplier?: number // for streaks
  }

  // Skill association
  skills?: SkillTag[]

  // Challenge metadata
  category: 'daily' | 'weekly' | 'special-event'
  isHidden?: boolean // Easter egg challenges
  prerequisite?: string // Other challenge ID that must be completed first
}

export type ChallengeRequirement =
  | MetricGoalRequirement
  | DecisionStreakRequirement
  | GrowthRateRequirement
  | EfficiencyRequirement
  | SurvivalRequirement
  | AdvisorWisdomRequirement
  | ScenarioPerfectRequirement
  | SkillFocusRequirement
  | CompetitionWinRequirement
  | RapidGrowthRequirement

export interface MetricGoalRequirement {
  type: 'metric-goal'
  metric: string
  targetValue: number
  operator: 'gte' | 'lte' | 'eq'
}

export interface DecisionStreakRequirement {
  type: 'decision-streak'
  count: number
  successRate?: number // minimum success rate (0-100)
}

export interface GrowthRateRequirement {
  type: 'growth-rate'
  metric: string
  targetRate: number // percentage
  duration: number // days to maintain
}

export interface EfficiencyRequirement {
  type: 'efficiency'
  numeratorMetric: string
  denominatorMetric: string
  targetRatio: number
}

export interface SurvivalRequirement {
  type: 'survival'
  metric: string
  minimumValue: number
  duration: number // days
}

export interface AdvisorWisdomRequirement {
  type: 'advisor-wisdom'
  advisorCount: number
  minQuestionsPerAdvisor: number
}

export interface ScenarioPerfectRequirement {
  type: 'scenario-perfect'
  scenarioId: string
  minimumScore: number
}

export interface SkillFocusRequirement {
  type: 'skill-focus'
  skill: SkillTag
  targetPoints: number
}

export interface CompetitionWinRequirement {
  type: 'competition-win'
  matchType?: 'head-to-head' | 'tournament' | 'marathon'
  minRanking?: number
}

export interface RapidGrowthRequirement {
  type: 'rapid-growth'
  metric: string
  targetValue: number
  maxTime: number // minutes
}

export interface ChallengeProgress {
  challengeId: string
  userId: string
  status: 'not-started' | 'in-progress' | 'completed' | 'failed' | 'expired'
  progress: number // 0-100
  startedAt?: Date
  completedAt?: Date
  currentValue?: any // Specific to challenge type
}

export interface PlayerChallengeStats {
  userId: string
  currentStreak: number
  longestStreak: number
  totalCompleted: number
  completionRate: number // 0-100
  lastCompletedDate?: Date
  totalXpEarned: number
  totalCoinsEarned: number
  favoriteCategory?: string
}

export interface DailyChallengeSet {
  date: string // YYYY-MM-DD
  challenges: Challenge[]
  bonusChallenge?: Challenge // Harder challenge with better rewards
}

// Predefined challenge templates for rotation
export interface ChallengeTemplate {
  id: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  title: string
  description: string
  icon: string
  requirements: Omit<ChallengeRequirement, 'type'>
  baseRewards: Challenge['rewards']
  skills?: SkillTag[]
  weight: number // For random selection (higher = more likely)
}
