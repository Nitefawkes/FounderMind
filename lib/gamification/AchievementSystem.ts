export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'milestone' | 'competition' | 'learning' | 'social' | 'mastery'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlockedAt?: number
  progress?: number
  requirement: number
}

export const ACHIEVEMENTS: Achievement[] = [
  // Milestone Achievements
  {
    id: 'first_startup',
    title: 'Entrepreneur',
    description: 'Start your first startup',
    icon: '🚀',
    category: 'milestone',
    rarity: 'common',
    xpReward: 100,
    requirement: 1,
  },
  {
    id: 'first_100_users',
    title: 'Breaking Through',
    description: 'Reach 100 users',
    icon: '📈',
    category: 'milestone',
    rarity: 'common',
    xpReward: 250,
    requirement: 100,
  },
  {
    id: 'first_1k_users',
    title: 'Going Viral',
    description: 'Reach 1,000 users',
    icon: '🎯',
    category: 'milestone',
    rarity: 'rare',
    xpReward: 500,
    requirement: 1000,
  },
  {
    id: 'first_10k_mrr',
    title: 'Revenue Machine',
    description: 'Hit $10k MRR',
    icon: '💰',
    category: 'milestone',
    rarity: 'rare',
    xpReward: 750,
    requirement: 10000,
  },
  {
    id: 'first_100k_mrr',
    title: 'Scaling Success',
    description: 'Hit $100k MRR',
    icon: '🏆',
    category: 'milestone',
    rarity: 'epic',
    xpReward: 2000,
    requirement: 100000,
  },
  {
    id: 'unicorn',
    title: 'Unicorn Status',
    description: 'Reach $1B valuation',
    icon: '🦄',
    category: 'milestone',
    rarity: 'legendary',
    xpReward: 10000,
    requirement: 1000000000,
  },

  // Competition Achievements
  {
    id: 'first_competition',
    title: 'Gladiator',
    description: 'Join your first competition',
    icon: '⚔️',
    category: 'competition',
    rarity: 'common',
    xpReward: 200,
    requirement: 1,
  },
  {
    id: 'first_win',
    title: 'Victor',
    description: 'Win your first competition',
    icon: '🥇',
    category: 'competition',
    rarity: 'rare',
    xpReward: 1000,
    requirement: 1,
  },
  {
    id: 'win_streak_3',
    title: 'On Fire',
    description: 'Win 3 competitions in a row',
    icon: '🔥',
    category: 'competition',
    rarity: 'epic',
    xpReward: 3000,
    requirement: 3,
  },
  {
    id: 'poach_master',
    title: 'Talent Scout',
    description: 'Successfully poach 10 employees',
    icon: '🎯',
    category: 'competition',
    rarity: 'rare',
    xpReward: 1500,
    requirement: 10,
  },
  {
    id: 'sabotage_expert',
    title: 'Master of Chaos',
    description: 'Execute 20 successful sabotage attacks',
    icon: '💣',
    category: 'competition',
    rarity: 'epic',
    xpReward: 2500,
    requirement: 20,
  },

  // Learning Achievements
  {
    id: 'first_advisor_chat',
    title: 'Seeking Wisdom',
    description: 'Have your first conversation with an advisor',
    icon: '💬',
    category: 'learning',
    rarity: 'common',
    xpReward: 150,
    requirement: 1,
  },
  {
    id: 'ask_all_advisors',
    title: 'Well Advised',
    description: 'Chat with all 5 advisors',
    icon: '🧠',
    category: 'learning',
    rarity: 'rare',
    xpReward: 750,
    requirement: 5,
  },
  {
    id: 'board_meeting_10',
    title: 'Board Room Regular',
    description: 'Conduct 10 board meetings',
    icon: '📋',
    category: 'learning',
    rarity: 'rare',
    xpReward: 1000,
    requirement: 10,
  },
  {
    id: 'scenario_complete',
    title: 'Student of History',
    description: 'Complete your first scenario',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    xpReward: 300,
    requirement: 1,
  },
  {
    id: 'all_scenarios',
    title: 'Master Historian',
    description: 'Complete all scenarios',
    icon: '🎓',
    category: 'learning',
    rarity: 'legendary',
    xpReward: 5000,
    requirement: 10, // Adjust based on total scenarios
  },

  // Mastery Achievements
  {
    id: 'survive_year',
    title: 'Survivor',
    description: 'Keep your startup alive for 1 year',
    icon: '⏱️',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 1000,
    requirement: 365,
  },
  {
    id: 'high_morale',
    title: 'Great Leader',
    description: 'Maintain 90+ team morale for 3 months',
    icon: '😊',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 800,
    requirement: 90,
  },
  {
    id: 'product_excellence',
    title: 'Quality Obsessed',
    description: 'Achieve 95+ product quality',
    icon: '⭐',
    category: 'mastery',
    rarity: 'epic',
    xpReward: 1500,
    requirement: 95,
  },
  {
    id: 'cockroach_mode',
    title: 'Cockroach Founder',
    description: 'Survive 2 years on less than $10k/month burn',
    icon: '🪳',
    category: 'mastery',
    rarity: 'epic',
    xpReward: 2500,
    requirement: 730,
  },
  {
    id: 'pivot_master',
    title: 'Master Pivotter',
    description: 'Successfully pivot 5 times',
    icon: '🔄',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 1200,
    requirement: 5,
  },

  // Social Achievements
  {
    id: 'spectate_first',
    title: 'Spectator',
    description: 'Watch your first competition',
    icon: '👁️',
    category: 'social',
    rarity: 'common',
    xpReward: 100,
    requirement: 1,
  },
]

export interface PlayerProgress {
  userId: string
  level: number
  totalXP: number
  unlockedAchievements: string[]
  achievementProgress: Record<string, number>
}

export class AchievementSystem {
  private progress: PlayerProgress

  constructor(userId: string, savedProgress?: Partial<PlayerProgress>) {
    this.progress = {
      userId,
      level: savedProgress?.level || 1,
      totalXP: savedProgress?.totalXP || 0,
      unlockedAchievements: savedProgress?.unlockedAchievements || [],
      achievementProgress: savedProgress?.achievementProgress || {},
    }
  }

  checkAchievement(achievementId: string, currentValue: number): {
    unlocked: boolean
    achievement?: Achievement
    levelUp?: number
  } {
    // Already unlocked
    if (this.progress.unlockedAchievements.includes(achievementId)) {
      return { unlocked: false }
    }

    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
    if (!achievement) {
      return { unlocked: false }
    }

    // Update progress
    this.progress.achievementProgress[achievementId] = currentValue

    // Check if requirement met
    if (currentValue >= achievement.requirement) {
      return this.unlockAchievement(achievement)
    }

    return { unlocked: false }
  }

  private unlockAchievement(achievement: Achievement): {
    unlocked: true
    achievement: Achievement
    levelUp?: number
  } {
    this.progress.unlockedAchievements.push(achievement.id)
    const previousLevel = this.progress.level
    this.progress.totalXP += achievement.xpReward

    // Level up calculation: 1000 XP per level
    this.progress.level = Math.floor(this.progress.totalXP / 1000) + 1

    const levelUp = this.progress.level > previousLevel ? this.progress.level : undefined

    return {
      unlocked: true,
      achievement: {
        ...achievement,
        unlockedAt: Date.now(),
      },
      levelUp,
    }
  }

  getProgress(): PlayerProgress {
    return { ...this.progress }
  }

  getUnlockedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter((a) => this.progress.unlockedAchievements.includes(a.id)).map(
      (a) => ({
        ...a,
        unlockedAt: Date.now(), // Would be stored in real implementation
      })
    )
  }

  getAvailableAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(
      (a) => !this.progress.unlockedAchievements.includes(a.id)
    ).map((a) => ({
      ...a,
      progress: this.progress.achievementProgress[a.id] || 0,
    }))
  }

  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return ACHIEVEMENTS.filter((a) => a.category === category)
  }

  getCompletionPercentage(): number {
    return (this.progress.unlockedAchievements.length / ACHIEVEMENTS.length) * 100
  }

  getNextLevelXP(): number {
    const currentLevelXP = (this.progress.level - 1) * 1000
    const nextLevelXP = this.progress.level * 1000
    return nextLevelXP - this.progress.totalXP
  }
}
