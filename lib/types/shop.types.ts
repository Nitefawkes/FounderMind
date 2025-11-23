/**
 * Shop & Monetization Types
 * Virtual currency, purchasable items, and premium tiers
 */

export type PremiumTier = 'free' | 'founder' | 'accelerator'

export type ShopItemCategory =
  | 'boosts'           // Temporary metric boosts
  | 'cosmetics'        // Visual customization
  | 'utilities'        // Helpful tools and features
  | 'scenarios'        // Premium scenarios
  | 'advisors'         // Special advisor unlocks
  | 'time-savers'      // Skip timers, instant actions
  | 'multipliers'      // XP/coin multipliers

export type ShopItemRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface ShopItem {
  id: string
  name: string
  description: string
  category: ShopItemCategory
  rarity: ShopItemRarity
  icon: string

  // Pricing
  price: {
    coins: number
    realMoney?: number // cents (e.g., 299 = $2.99)
  }

  // Purchase restrictions
  purchaseLimit?: {
    type: 'daily' | 'weekly' | 'lifetime'
    amount: number
  }
  requiresPremium?: PremiumTier
  requiredLevel?: number

  // Item effects
  effects: ShopItemEffect[]

  // Sale/special
  onSale?: {
    discountPercent: number
    endsAt: Date
  }

  // Metadata
  isNew?: boolean
  isFeatured?: boolean
  isBestValue?: boolean
}

export type ShopItemEffect =
  | MetricBoostEffect
  | MultiplierEffect
  | UnlockEffect
  | CosmeticEffect
  | TimeSkipEffect
  | SpecialEffect

export interface MetricBoostEffect {
  type: 'metric-boost'
  metric: string
  amount: number
  duration?: number // minutes, undefined = permanent
}

export interface MultiplierEffect {
  type: 'multiplier'
  target: 'xp' | 'coins' | 'all-rewards'
  multiplier: number // 1.5 = 50% boost
  duration: number // minutes
}

export interface UnlockEffect {
  type: 'unlock'
  unlocks: string[] // scenario IDs, advisor IDs, feature IDs
}

export interface CosmeticEffect {
  type: 'cosmetic'
  cosmetic: {
    type: 'theme' | 'avatar' | 'badge' | 'animation'
    id: string
  }
}

export interface TimeSkipEffect {
  type: 'time-skip'
  skipAmount: number // days
}

export interface SpecialEffect {
  type: 'special'
  specialId: string
  description: string
}

export interface PlayerInventory {
  userId: string
  coins: number
  items: InventoryItem[]
  activeBoosts: ActiveBoost[]
  cosmetics: string[]
  purchaseHistory: Purchase[]
}

export interface InventoryItem {
  shopItemId: string
  quantity: number
  purchasedAt: Date
}

export interface ActiveBoost {
  itemId: string
  effect: ShopItemEffect
  activatedAt: Date
  expiresAt?: Date
}

export interface Purchase {
  id: string
  itemId: string
  price: number
  purchasedAt: Date
  paymentMethod: 'coins' | 'real-money'
}

export interface PremiumTierConfig {
  tier: PremiumTier
  name: string
  price: number // monthly in cents
  yearlyPrice?: number // yearly in cents (with discount)
  features: PremiumFeature[]
  limits: PremiumLimits
  badge: string
  color: string
}

export interface PremiumFeature {
  id: string
  name: string
  description: string
  icon: string
}

export interface PremiumLimits {
  activeStartups: number
  scenariosPerDay: number | 'unlimited'
  advisorQuestions: number | 'unlimited'
  competitionMatches: number | 'unlimited'
  dailyChallenges: number | 'unlimited'
  cloudSaves: number
  customScenarios: boolean
  apiAccess: boolean
  prioritySupport: boolean
}

export interface PlayerSubscription {
  userId: string
  tier: PremiumTier
  startDate: Date
  renewalDate?: Date
  canceledAt?: Date
  isActive: boolean
  paymentMethod?: string
}

// Predefined shop catalog
export const SHOP_CATALOG: ShopItem[] = [
  // Boosts
  {
    id: 'revenue-rocket',
    name: 'Revenue Rocket 🚀',
    description: 'Double your MRR for 24 hours',
    category: 'boosts',
    rarity: 'rare',
    icon: '💰',
    price: { coins: 500 },
    purchaseLimit: { type: 'daily', amount: 1 },
    effects: [
      {
        type: 'metric-boost',
        metric: 'mrr',
        amount: 2,
        duration: 1440 // 24 hours
      }
    ]
  },
  {
    id: 'morale-boost',
    name: 'Team Pizza Party 🍕',
    description: '+20 team morale for 48 hours',
    category: 'boosts',
    rarity: 'common',
    icon: '🍕',
    price: { coins: 200 },
    purchaseLimit: { type: 'daily', amount: 3 },
    effects: [
      {
        type: 'metric-boost',
        metric: 'teamMorale',
        amount: 20,
        duration: 2880
      }
    ]
  },
  {
    id: 'growth-accelerator',
    name: 'Growth Accelerator ⚡',
    description: '+50% user growth rate for 7 days',
    category: 'boosts',
    rarity: 'epic',
    icon: '📈',
    price: { coins: 1000 },
    purchaseLimit: { type: 'weekly', amount: 1 },
    effects: [
      {
        type: 'metric-boost',
        metric: 'userGrowthRate',
        amount: 1.5,
        duration: 10080
      }
    ]
  },

  // Multipliers
  {
    id: 'double-xp',
    name: '2x XP Boost',
    description: 'Earn double XP for 1 hour',
    category: 'multipliers',
    rarity: 'common',
    icon: '⭐',
    price: { coins: 150 },
    effects: [
      {
        type: 'multiplier',
        target: 'xp',
        multiplier: 2,
        duration: 60
      }
    ]
  },
  {
    id: 'mega-multiplier',
    name: 'Mega Multiplier 💎',
    description: '3x all rewards for 30 minutes',
    category: 'multipliers',
    rarity: 'legendary',
    icon: '💎',
    price: { coins: 2000 },
    purchaseLimit: { type: 'daily', amount: 1 },
    isFeatured: true,
    effects: [
      {
        type: 'multiplier',
        target: 'all-rewards',
        multiplier: 3,
        duration: 30
      }
    ]
  },

  // Utilities
  {
    id: 'time-skip-7d',
    name: '7-Day Time Skip ⏩',
    description: 'Instantly advance 7 days in simulation',
    category: 'time-savers',
    rarity: 'rare',
    icon: '⏩',
    price: { coins: 800 },
    requiresPremium: 'founder',
    effects: [
      {
        type: 'time-skip',
        skipAmount: 7
      }
    ]
  },
  {
    id: 'scenario-unlock-pack',
    name: 'Scenario Pack: Unicorns 🦄',
    description: 'Unlock 5 premium unicorn startup scenarios',
    category: 'scenarios',
    rarity: 'epic',
    icon: '🦄',
    price: { coins: 1500, realMoney: 499 },
    purchaseLimit: { type: 'lifetime', amount: 1 },
    isNew: true,
    effects: [
      {
        type: 'unlock',
        unlocks: ['facebook-harvard', 'google-stanford', 'amazon-books', 'netflix-dvd', 'tesla-roadster']
      }
    ]
  },

  // Special Advisors
  {
    id: 'elon-advisor',
    name: 'Elon Mode 🚗',
    description: 'Unlock Elon Musk as a special advisor',
    category: 'advisors',
    rarity: 'legendary',
    icon: '🚗',
    price: { coins: 5000, realMoney: 999 },
    purchaseLimit: { type: 'lifetime', amount: 1 },
    requiresPremium: 'founder',
    isFeatured: true,
    isBestValue: true,
    effects: [
      {
        type: 'unlock',
        unlocks: ['elon-musk-advisor']
      }
    ]
  },
  {
    id: 'steve-jobs-advisor',
    name: 'Think Different 🍎',
    description: 'Unlock Steve Jobs as a special advisor',
    category: 'advisors',
    rarity: 'legendary',
    icon: '🍎',
    price: { coins: 5000, realMoney: 999 },
    purchaseLimit: { type: 'lifetime', amount: 1 },
    requiresPremium: 'founder',
    effects: [
      {
        type: 'unlock',
        unlocks: ['steve-jobs-advisor']
      }
    ]
  },

  // Cosmetics
  {
    id: 'cyberpunk-theme',
    name: 'Cyberpunk 2077 Theme',
    description: 'Yellow & black cyberpunk UI theme',
    category: 'cosmetics',
    rarity: 'rare',
    icon: '🌆',
    price: { coins: 1000 },
    effects: [
      {
        type: 'cosmetic',
        cosmetic: { type: 'theme', id: 'cyberpunk-2077' }
      }
    ]
  },
  {
    id: 'founder-badge',
    name: 'Founder Badge',
    description: 'Display "OG Founder" badge on profile',
    category: 'cosmetics',
    rarity: 'epic',
    icon: '🏆',
    price: { coins: 2500 },
    purchaseLimit: { type: 'lifetime', amount: 1 },
    effects: [
      {
        type: 'cosmetic',
        cosmetic: { type: 'badge', id: 'og-founder' }
      }
    ]
  }
]

// Premium tier configurations
export const PREMIUM_TIERS: Record<PremiumTier, PremiumTierConfig> = {
  free: {
    tier: 'free',
    name: 'Free',
    price: 0,
    features: [
      { id: 'basic-sim', name: '1 Active Startup', description: 'Run one startup simulation', icon: '🏢' },
      { id: 'basic-advisors', name: 'Basic Advisors', description: '5 questions per advisor daily', icon: '🧠' },
      { id: 'basic-scenarios', name: '5 Scenarios', description: 'Access to 5 starter scenarios', icon: '📚' },
      { id: 'basic-compete', name: 'Limited Multiplayer', description: '3 matches per day', icon: '⚔️' }
    ],
    limits: {
      activeStartups: 1,
      scenariosPerDay: 5,
      advisorQuestions: 5,
      competitionMatches: 3,
      dailyChallenges: 3,
      cloudSaves: 1,
      customScenarios: false,
      apiAccess: false,
      prioritySupport: false
    },
    badge: '🆓',
    color: '#888888'
  },
  founder: {
    tier: 'founder',
    name: 'Founder',
    price: 999, // $9.99/month
    yearlyPrice: 9900, // $99/year (2 months free)
    features: [
      { id: 'multi-sim', name: '3 Active Startups', description: 'Run up to 3 simultaneous startups', icon: '🏢' },
      { id: 'all-advisors', name: 'All Advisors', description: 'Unlimited questions to all advisors', icon: '🧠' },
      { id: 'all-scenarios', name: 'All Scenarios', description: 'Access to 50+ scenarios', icon: '📚' },
      { id: 'unlimited-compete', name: 'Unlimited Multiplayer', description: 'No match limits', icon: '⚔️' },
      { id: 'advanced-analytics', name: 'Advanced Analytics', description: 'Deep insights and reports', icon: '📊' },
      { id: 'priority-challenges', name: 'Bonus Challenges', description: 'Extra daily challenges', icon: '🎯' }
    ],
    limits: {
      activeStartups: 3,
      scenariosPerDay: 'unlimited',
      advisorQuestions: 'unlimited',
      competitionMatches: 'unlimited',
      dailyChallenges: 'unlimited',
      cloudSaves: 10,
      customScenarios: false,
      apiAccess: false,
      prioritySupport: false
    },
    badge: '👑',
    color: '#00FFB2'
  },
  accelerator: {
    tier: 'accelerator',
    name: 'Accelerator',
    price: 2999, // $29.99/month
    yearlyPrice: 29900, // $299/year (2 months free)
    features: [
      { id: 'unlimited-sim', name: 'Unlimited Startups', description: 'No limits on active startups', icon: '🏢' },
      { id: 'custom-advisors', name: 'Custom Advisors', description: 'Create your own AI advisors', icon: '🧠' },
      { id: 'scenario-creator', name: 'Scenario Creator', description: 'Build and share custom scenarios', icon: '✏️' },
      { id: 'private-compete', name: 'Private Competitions', description: 'Host private tournaments', icon: '🏆' },
      { id: 'api-access', name: 'API Access', description: 'Programmatic access to platform', icon: '🔌' },
      { id: 'white-label', name: 'White Label', description: 'Use in schools/organizations', icon: '🎓' },
      { id: 'priority-support', name: 'Priority Support', description: '24/7 dedicated support', icon: '💬' }
    ],
    limits: {
      activeStartups: 999,
      scenariosPerDay: 'unlimited',
      advisorQuestions: 'unlimited',
      competitionMatches: 'unlimited',
      dailyChallenges: 'unlimited',
      cloudSaves: 999,
      customScenarios: true,
      apiAccess: true,
      prioritySupport: true
    },
    badge: '🚀',
    color: '#FF00E5'
  }
}
