// Database Types for FounderMind

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          experience_points: number
          founder_level: number
          skill_tree: Json
          subscription_tier: 'free' | 'founder' | 'accelerator'
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          experience_points?: number
          founder_level?: number
          skill_tree?: Json
          subscription_tier?: 'free' | 'founder' | 'accelerator'
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          experience_points?: number
          founder_level?: number
          skill_tree?: Json
          subscription_tier?: 'free' | 'founder' | 'accelerator'
        }
      }
      startups: {
        Row: {
          id: string
          user_id: string
          name: string
          industry: string
          stage: 'idea' | 'mvp' | 'launch' | 'growth' | 'scale' | 'exit'
          current_capital: number
          created_at: string
          updated_at: string
          metrics: StartupMetrics
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          industry: string
          stage?: 'idea' | 'mvp' | 'launch' | 'growth' | 'scale' | 'exit'
          current_capital?: number
          created_at?: string
          updated_at?: string
          metrics?: StartupMetrics
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          industry?: string
          stage?: 'idea' | 'mvp' | 'launch' | 'growth' | 'scale' | 'exit'
          current_capital?: number
          created_at?: string
          updated_at?: string
          metrics?: StartupMetrics
          is_active?: boolean
        }
      }
      decisions: {
        Row: {
          id: string
          startup_id: string
          type: DecisionType
          choice: string
          outcome: Json
          impact: number
          timestamp: string
        }
        Insert: {
          id?: string
          startup_id: string
          type: DecisionType
          choice: string
          outcome?: Json
          impact?: number
          timestamp?: string
        }
        Update: {
          id?: string
          startup_id?: string
          type?: DecisionType
          choice?: string
          outcome?: Json
          impact?: number
          timestamp?: string
        }
      }
      scenarios: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          unlocked_at_level: number
          stages: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          unlocked_at_level?: number
          stages?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          unlocked_at_level?: number
          stages?: Json
          created_at?: string
        }
      }
      advisor_interactions: {
        Row: {
          id: string
          startup_id: string
          persona: AdvisorPersona
          message: string
          advice: string
          context: Json
          timestamp: string
        }
        Insert: {
          id?: string
          startup_id: string
          persona: AdvisorPersona
          message: string
          advice: string
          context?: Json
          timestamp?: string
        }
        Update: {
          id?: string
          startup_id?: string
          persona?: AdvisorPersona
          message?: string
          advice?: string
          context?: Json
          timestamp?: string
        }
      }
      market_events: {
        Row: {
          id: string
          type: string
          impact: Json
          triggered_by: string | null
          timestamp: string
          affected_startups: string[]
        }
        Insert: {
          id?: string
          type: string
          impact: Json
          triggered_by?: string | null
          timestamp?: string
          affected_startups?: string[]
        }
        Update: {
          id?: string
          type?: string
          impact?: Json
          triggered_by?: string | null
          timestamp?: string
          affected_startups?: string[]
        }
      }
      competitions: {
        Row: {
          id: string
          players: string[]
          winner: string | null
          market_snapshot: Json
          started_at: string
          ended_at: string | null
          status: 'waiting' | 'active' | 'completed'
        }
        Insert: {
          id?: string
          players: string[]
          winner?: string | null
          market_snapshot?: Json
          started_at?: string
          ended_at?: string | null
          status?: 'waiting' | 'active' | 'completed'
        }
        Update: {
          id?: string
          players?: string[]
          winner?: string | null
          market_snapshot?: Json
          started_at?: string
          ended_at?: string | null
          status?: 'waiting' | 'active' | 'completed'
        }
      }
    }
  }
}

// Startup Metrics
export interface StartupMetrics {
  burn_rate: number // Monthly burn in dollars
  runway: number // Months until out of money
  mrr: number // Monthly Recurring Revenue
  user_count: number
  user_growth_rate: number // Percentage
  team_size: number
  team_morale: number // 0-100
  product_quality: number // 0-100
  market_share: number // Percentage
  valuation: number
  customer_satisfaction: number // 0-100
}

// Decision Types
export type DecisionType =
  | 'hire'
  | 'fire'
  | 'pivot'
  | 'fundraise'
  | 'build_feature'
  | 'marketing_campaign'
  | 'price_change'
  | 'partnership'
  | 'acquisition'
  | 'expansion'

// Advisor Personas
export type AdvisorPersona = 'ceo' | 'cto' | 'cfo' | 'cmo' | 'investor'

// Persona Details
export interface PersonaConfig {
  name: string
  title: string
  expertise: string[]
  personality: string
  background: string
  advice_style: string
  avatar?: string
}

// Scenario Stage
export interface ScenarioStage {
  title: string
  context: string
  decisions: string[]
  correct: number
  lesson: string
  impact?: {
    capital?: number
    morale?: number
    growth?: number
  }
}

// Market Conditions
export interface MarketConditions {
  industry: string
  market_size: number
  growth_rate: number
  competition_level: number // 0-100
  economic_cycle: 'boom' | 'normal' | 'recession'
  trends: string[]
}

// Team Member
export interface TeamMember {
  id: string
  name: string
  role: string
  skills: string[]
  salary: number
  equity: number
  morale: number
  productivity: number
  hired_at: string
}

// Competition State
export interface CompetitionState {
  id: string
  players: {
    user_id: string
    startup_id: string
    current_metrics: StartupMetrics
  }[]
  market: MarketConditions
  turn: number
  max_turns: number
}
