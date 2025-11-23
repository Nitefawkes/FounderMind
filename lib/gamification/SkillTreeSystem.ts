/**
 * Skill Tree System - Manages player skill progression and unlocks
 */

import type {
  SkillTree,
  SkillNode,
  SkillTag,
  PlayerSkills,
} from '@/lib/types/scenario.types'

/**
 * Skill progression configuration
 * Points required for each level follow an exponential curve
 */
const POINTS_PER_LEVEL = [
  0,    // Level 0
  100,  // Level 1
  250,  // Level 2
  450,  // Level 3
  700,  // Level 4
  1000, // Level 5
  1400, // Level 6
  1900, // Level 7
  2500, // Level 8
  3200, // Level 9
  4000, // Level 10 (max)
]

/**
 * Default skill tree configuration
 */
export const DEFAULT_SKILL_TREE: SkillTree = {
  skills: [
    {
      id: 'leadership',
      skill: 'leadership',
      name: 'Leadership',
      description: 'Inspire and guide your team, make strategic decisions, and build company culture.',
      icon: '👑',
      maxLevel: 10,
      unlocks: {
        scenarios: ['leadership-crisis', 'board-conflicts'],
        features: ['advanced-team-management'],
        advisorInsights: ['ceo-deep-insights']
      }
    },
    {
      id: 'technical',
      skill: 'technical',
      name: 'Technical Expertise',
      description: 'Understand technology, architecture decisions, and product development.',
      icon: '💻',
      maxLevel: 10,
      unlocks: {
        scenarios: ['technical-debt', 'platform-migration'],
        features: ['architecture-dashboard'],
        advisorInsights: ['cto-deep-insights']
      }
    },
    {
      id: 'financial',
      skill: 'financial',
      name: 'Financial Management',
      description: 'Master burn rate, runway, fundraising, and financial modeling.',
      icon: '💰',
      maxLevel: 10,
      unlocks: {
        scenarios: ['series-a-negotiation', 'cash-crisis'],
        features: ['advanced-financial-modeling'],
        advisorInsights: ['cfo-deep-insights']
      }
    },
    {
      id: 'marketing',
      skill: 'marketing',
      name: 'Marketing & Growth',
      description: 'Build brand, acquire customers, and create viral growth loops.',
      icon: '📈',
      maxLevel: 10,
      unlocks: {
        scenarios: ['viral-marketing', 'rebranding'],
        features: ['growth-experiment-lab'],
        advisorInsights: ['cmo-deep-insights']
      }
    },
    {
      id: 'product',
      skill: 'product',
      name: 'Product Development',
      description: 'Find product-market fit, prioritize features, and understand users.',
      icon: '🎯',
      maxLevel: 10,
      unlocks: {
        scenarios: ['product-market-fit', 'feature-prioritization'],
        features: ['user-research-tools']
      }
    },
    {
      id: 'strategy',
      skill: 'strategy',
      name: 'Strategic Thinking',
      description: 'Long-term planning, competitive analysis, and market positioning.',
      icon: '🎲',
      maxLevel: 10,
      prerequisites: ['leadership'],
      unlocks: {
        scenarios: ['market-entry', 'competitive-response'],
        features: ['strategy-simulator']
      }
    },
    {
      id: 'operations',
      skill: 'operations',
      name: 'Operations',
      description: 'Scale processes, manage logistics, and optimize efficiency.',
      icon: '⚙️',
      maxLevel: 10,
      unlocks: {
        scenarios: ['scaling-operations', 'supply-chain-crisis']
      }
    },
    {
      id: 'fundraising',
      skill: 'fundraising',
      name: 'Fundraising',
      description: 'Pitch to investors, negotiate terms, and manage investor relations.',
      icon: '🤝',
      maxLevel: 10,
      prerequisites: ['financial'],
      unlocks: {
        scenarios: ['seed-round', 'series-b-dilution'],
        features: ['pitch-deck-generator'],
        advisorInsights: ['investor-deep-insights']
      }
    },
    {
      id: 'growth-hacking',
      skill: 'growth-hacking',
      name: 'Growth Hacking',
      description: 'Unconventional growth tactics, viral loops, and rapid experimentation.',
      icon: '🚀',
      maxLevel: 10,
      prerequisites: ['marketing', 'product'],
      unlocks: {
        scenarios: ['viral-mechanics', 'growth-at-all-costs']
      }
    },
    {
      id: 'crisis-management',
      skill: 'crisis-management',
      name: 'Crisis Management',
      description: 'Handle emergencies, make decisions under pressure, and recover from setbacks.',
      icon: '🔥',
      maxLevel: 10,
      prerequisites: ['leadership'],
      unlocks: {
        scenarios: ['pr-disaster', 'runway-emergency', 'cofounder-conflict']
      }
    }
  ]
}

export class SkillTreeSystem {
  private skillTree: SkillTree
  private playerSkills: PlayerSkills

  constructor(playerSkills?: PlayerSkills) {
    this.skillTree = DEFAULT_SKILL_TREE

    this.playerSkills = playerSkills || {
      userId: '',
      skills: {},
      totalSkillPoints: 0
    }
  }

  /**
   * Add skill points and level up if threshold reached
   */
  addSkillPoints(skill: SkillTag, points: number): {
    levelsGained: number
    newLevel: number
    unlocks: string[]
  } {
    const currentSkillData = this.playerSkills.skills[skill] || {
      level: 0,
      points: 0,
      pointsToNextLevel: POINTS_PER_LEVEL[1]
    }

    const newPoints = currentSkillData.points + points
    this.playerSkills.totalSkillPoints += points

    // Calculate new level
    let newLevel = currentSkillData.level
    const skillNode = this.getSkillNode(skill)
    const maxLevel = skillNode?.maxLevel || 10

    while (newLevel < maxLevel && newPoints >= POINTS_PER_LEVEL[newLevel + 1]) {
      newLevel++
    }

    const levelsGained = newLevel - currentSkillData.level

    // Update player skills
    this.playerSkills.skills[skill] = {
      level: newLevel,
      points: newPoints,
      pointsToNextLevel: newLevel < maxLevel ? POINTS_PER_LEVEL[newLevel + 1] - newPoints : 0
    }

    // Get unlocks for new level
    const unlocks = this.getUnlocksForLevel(skill, newLevel)

    return {
      levelsGained,
      newLevel,
      unlocks
    }
  }

  /**
   * Get skill node configuration
   */
  getSkillNode(skill: SkillTag): SkillNode | undefined {
    return this.skillTree.skills.find(s => s.skill === skill)
  }

  /**
   * Check if skill is unlocked (prerequisites met)
   */
  isSkillUnlocked(skill: SkillTag): boolean {
    const skillNode = this.getSkillNode(skill)
    if (!skillNode || !skillNode.prerequisites) return true

    return skillNode.prerequisites.every(prereqId => {
      const prereqNode = this.skillTree.skills.find(s => s.id === prereqId)
      if (!prereqNode) return false

      const playerSkillData = this.playerSkills.skills[prereqNode.skill]
      return playerSkillData && playerSkillData.level >= 1
    })
  }

  /**
   * Get all unlocks for reaching a specific level in a skill
   */
  private getUnlocksForLevel(skill: SkillTag, level: number): string[] {
    const skillNode = this.getSkillNode(skill)
    if (!skillNode) return []

    const unlocks: string[] = []

    // Add scenario unlocks (unlock at specific levels)
    if (skillNode.unlocks.scenarios) {
      // Unlock scenarios progressively
      const scenariosPerLevel = Math.ceil(skillNode.unlocks.scenarios.length / skillNode.maxLevel)
      const unlockIndex = (level - 1) * scenariosPerLevel
      unlocks.push(...skillNode.unlocks.scenarios.slice(unlockIndex, unlockIndex + scenariosPerLevel))
    }

    // Add feature unlocks (unlock at level 5)
    if (level >= 5 && skillNode.unlocks.features) {
      unlocks.push(...skillNode.unlocks.features)
    }

    // Add advisor insights (unlock at level 8)
    if (level >= 8 && skillNode.unlocks.advisorInsights) {
      unlocks.push(...skillNode.unlocks.advisorInsights)
    }

    return unlocks
  }

  /**
   * Get skill progress for display
   */
  getSkillProgress(skill: SkillTag): {
    level: number
    points: number
    pointsToNextLevel: number
    percentToNext: number
    isMaxLevel: boolean
    isUnlocked: boolean
  } | null {
    const skillData = this.playerSkills.skills[skill]
    const skillNode = this.getSkillNode(skill)

    if (!skillNode) return null

    const level = skillData?.level || 0
    const points = skillData?.points || 0
    const maxLevel = skillNode.maxLevel

    if (level >= maxLevel) {
      return {
        level: maxLevel,
        points,
        pointsToNextLevel: 0,
        percentToNext: 100,
        isMaxLevel: true,
        isUnlocked: this.isSkillUnlocked(skill)
      }
    }

    const pointsForCurrentLevel = POINTS_PER_LEVEL[level]
    const pointsForNextLevel = POINTS_PER_LEVEL[level + 1]
    const pointsInCurrentLevel = points - pointsForCurrentLevel
    const pointsNeededForLevel = pointsForNextLevel - pointsForCurrentLevel

    return {
      level,
      points,
      pointsToNextLevel: pointsNeededForLevel - pointsInCurrentLevel,
      percentToNext: (pointsInCurrentLevel / pointsNeededForLevel) * 100,
      isMaxLevel: false,
      isUnlocked: this.isSkillUnlocked(skill)
    }
  }

  /**
   * Get all available skills for player
   */
  getAvailableSkills(): SkillNode[] {
    return this.skillTree.skills.filter(skill => this.isSkillUnlocked(skill.skill))
  }

  /**
   * Get locked skills with prerequisites
   */
  getLockedSkills(): Array<SkillNode & { missingPrereqs: string[] }> {
    return this.skillTree.skills
      .filter(skill => !this.isSkillUnlocked(skill.skill))
      .map(skill => ({
        ...skill,
        missingPrereqs: skill.prerequisites?.filter(prereqId => {
          const prereqNode = this.skillTree.skills.find(s => s.id === prereqId)
          if (!prereqNode) return true

          const playerSkillData = this.playerSkills.skills[prereqNode.skill]
          return !playerSkillData || playerSkillData.level < 1
        }) || []
      }))
  }

  /**
   * Get player's strongest skills
   */
  getTopSkills(limit: number = 5): Array<{ skill: SkillTag, level: number, points: number }> {
    const skills = Object.entries(this.playerSkills.skills)
      .map(([skill, data]) => ({
        skill: skill as SkillTag,
        level: data.level,
        points: data.points
      }))
      .sort((a, b) => b.points - a.points)

    return skills.slice(0, limit)
  }

  /**
   * Get recommended scenarios based on skill level
   */
  getRecommendedFocus(): SkillTag[] {
    const skills = Object.entries(this.playerSkills.skills)
      .map(([skill, data]) => ({
        skill: skill as SkillTag,
        level: data.level
      }))
      .sort((a, b) => a.level - b.level)

    // Recommend leveling up weakest skills first
    return skills.slice(0, 3).map(s => s.skill)
  }

  /**
   * Get current player skills
   */
  getPlayerSkills(): PlayerSkills {
    return { ...this.playerSkills }
  }

  /**
   * Get the full skill tree
   */
  getSkillTree(): SkillTree {
    return this.skillTree
  }
}
