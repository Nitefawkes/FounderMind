/**
 * Scenario Engine - Executes educational scenarios and tracks player progress
 */

import type {
  Scenario,
  ScenarioProgress,
  ScenarioMetrics,
  ScenarioDecision,
  ScenarioOption,
  ScenarioOutcome,
  PlayerSkills,
  SkillTag,
  CaseStudy,
} from '@/lib/types/scenario.types'

export class ScenarioEngine {
  private scenario: Scenario
  private progress: ScenarioProgress

  constructor(scenario: Scenario, existingProgress?: ScenarioProgress) {
    this.scenario = scenario

    if (existingProgress) {
      this.progress = existingProgress
    } else {
      // Initialize new progress
      this.progress = {
        scenarioId: scenario.id,
        userId: '', // Will be set when user context is available
        status: 'not-started',
        currentDecisionIndex: 0,
        decisionHistory: [],
        currentMetrics: { ...scenario.initialState },
        skillsEarned: [],
      }
    }
  }

  /**
   * Start or resume the scenario
   */
  start(): void {
    if (this.progress.status === 'not-started') {
      this.progress.status = 'in-progress'
      this.progress.startedAt = new Date()
    }
  }

  /**
   * Get the current decision to present to the player
   */
  getCurrentDecision(): ScenarioDecision | null {
    if (this.progress.status === 'completed' || this.progress.status === 'failed') {
      return null
    }

    const currentIndex = this.progress.currentDecisionIndex
    if (currentIndex >= this.scenario.decisions.length) {
      return null
    }

    return this.scenario.decisions[currentIndex]
  }

  /**
   * Make a decision and progress the scenario
   */
  async makeDecision(optionId: string): Promise<{
    outcome: ScenarioOutcome
    nextDecision: ScenarioDecision | null
    scenarioComplete: boolean
    success?: boolean
    analysis?: CaseStudy['analysis']
  }> {
    const currentDecision = this.getCurrentDecision()
    if (!currentDecision) {
      throw new Error('No current decision available')
    }

    const selectedOption = currentDecision.options.find(opt => opt.id === optionId)
    if (!selectedOption) {
      throw new Error(`Option ${optionId} not found`)
    }

    // Record decision
    this.progress.decisionHistory.push({
      decisionId: currentDecision.id,
      optionId: selectedOption.id,
      timestamp: new Date(),
    })

    // Apply immediate outcome
    this.applyMetricChanges(selectedOption.outcomes.immediate.metricChanges)

    // Award skill points
    if (selectedOption.outcomes.skillPoints) {
      selectedOption.outcomes.skillPoints.forEach(skill => {
        this.addSkillPoints(skill.skill, skill.points)
      })
    }

    // Schedule long-term outcome if exists
    if (selectedOption.outcomes.longTerm) {
      // In a real implementation, this would be scheduled
      // For now, we'll apply it immediately for simulation purposes
      this.applyMetricChanges(selectedOption.outcomes.longTerm.metricChanges)
    }

    // Determine next decision
    let nextDecision: ScenarioDecision | null = null
    let scenarioComplete = false

    if (selectedOption.outcomes.nextDecisionId) {
      // Branching scenario - find specific next decision
      const nextDec = this.scenario.decisions.find(
        d => d.id === selectedOption.outcomes.nextDecisionId
      )
      if (nextDec) {
        nextDecision = nextDec
        this.progress.currentDecisionIndex = this.scenario.decisions.indexOf(nextDec)
      }
    } else {
      // Linear progression - move to next decision
      this.progress.currentDecisionIndex++
      if (this.progress.currentDecisionIndex < this.scenario.decisions.length) {
        nextDecision = this.scenario.decisions[this.progress.currentDecisionIndex]
      } else {
        // No more decisions - scenario complete
        scenarioComplete = true
        this.completeScenario()
      }
    }

    return {
      outcome: selectedOption.outcomes,
      nextDecision,
      scenarioComplete,
      success: this.progress.status === 'completed',
      analysis: scenarioComplete ? this.generateCaseStudy() : undefined,
    }
  }

  /**
   * Apply metric changes to current state
   */
  private applyMetricChanges(changes: Partial<ScenarioMetrics>): void {
    Object.keys(changes).forEach(key => {
      const metricKey = key as keyof ScenarioMetrics
      const currentValue = this.progress.currentMetrics[metricKey] || 0
      const change = changes[metricKey] || 0
      this.progress.currentMetrics[metricKey] = currentValue + change
    })
  }

  /**
   * Add skill points to player's skills
   */
  private addSkillPoints(skill: SkillTag, points: number): void {
    const existing = this.progress.skillsEarned?.find(s => s.skill === skill)
    if (existing) {
      existing.points += points
    } else {
      this.progress.skillsEarned?.push({ skill, points })
    }
  }

  /**
   * Complete the scenario and calculate final score
   */
  private completeScenario(): void {
    const success = this.checkSuccessCriteria()

    if (success) {
      this.progress.status = 'completed'
      this.progress.score = this.calculateScore()
    } else {
      this.progress.status = 'failed'
      this.progress.score = this.calculateScore()
    }

    this.progress.completedAt = new Date()
  }

  /**
   * Check if success criteria are met
   */
  private checkSuccessCriteria(): boolean {
    return this.scenario.successCriteria.every(criterion => {
      const currentValue = this.progress.currentMetrics[criterion.metric]
      const targetValue = criterion.value

      switch (criterion.operator) {
        case 'gt':
          return currentValue > targetValue
        case 'gte':
          return currentValue >= targetValue
        case 'lt':
          return currentValue < targetValue
        case 'lte':
          return currentValue <= targetValue
        case 'eq':
          return currentValue === targetValue
        default:
          return false
      }
    })
  }

  /**
   * Calculate final score (0-100)
   */
  private calculateScore(): number {
    let totalScore = 0
    const criteriaCount = this.scenario.successCriteria.length

    this.scenario.successCriteria.forEach(criterion => {
      const currentValue = this.progress.currentMetrics[criterion.metric]
      const targetValue = criterion.value

      // Calculate percentage of target achieved
      const percentageAchieved = (currentValue / targetValue) * 100
      totalScore += Math.min(100, Math.max(0, percentageAchieved))
    })

    return Math.round(totalScore / criteriaCount)
  }

  /**
   * Generate case study analysis comparing player decisions to optimal choices
   */
  private generateCaseStudy(): CaseStudy['analysis'] {
    const playerDecisions = this.progress.decisionHistory.map(history => {
      const decision = this.scenario.decisions.find(d => d.id === history.decisionId)
      const option = decision?.options.find(o => o.id === history.optionId)

      // Determine if this was optimal (highest skill points = optimal in this simple implementation)
      const allOptions = decision?.options || []
      const maxSkillPoints = Math.max(
        ...allOptions.map(opt =>
          opt.outcomes.skillPoints?.reduce((sum, sp) => sum + sp.points, 0) || 0
        )
      )
      const playerSkillPoints = option?.outcomes.skillPoints?.reduce((sum, sp) => sum + sp.points, 0) || 0

      return {
        decisionId: history.decisionId,
        optionChosen: option?.label || 'Unknown',
        actualChoice: option?.analysis.realWorldExample,
        outcome: playerSkillPoints === maxSkillPoints ? 'optimal' as const :
                 playerSkillPoints > maxSkillPoints * 0.6 ? 'alternative' as const :
                 'suboptimal' as const
      }
    })

    const score = this.progress.score || 0
    let grade: CaseStudy['analysis']['overallPerformance']['grade']
    if (score >= 95) grade = 'A+'
    else if (score >= 90) grade = 'A'
    else if (score >= 80) grade = 'B'
    else if (score >= 70) grade = 'C'
    else if (score >= 60) grade = 'D'
    else grade = 'F'

    const optimalDecisions = playerDecisions.filter(d => d.outcome === 'optimal').length
    const totalDecisions = playerDecisions.length

    return {
      playerDecisions,
      overallPerformance: {
        score,
        grade,
        comparison: `You made ${optimalDecisions}/${totalDecisions} optimal decisions. ${
          score >= 80 ? 'Excellent strategic thinking!' :
          score >= 60 ? 'Good instincts with room for improvement.' :
          'Consider reviewing the analysis to understand alternative approaches.'
        }`
      },
      keyLearnings: this.scenario.learningObjectives,
      recommendedResources: []
    }
  }

  /**
   * Get current progress
   */
  getProgress(): ScenarioProgress {
    return { ...this.progress }
  }

  /**
   * Get scenario metadata
   */
  getScenario(): Scenario {
    return this.scenario
  }

  /**
   * Calculate time remaining (if time limit exists)
   */
  calculateTimeRemaining(currentDecision: ScenarioDecision): number | null {
    if (!currentDecision.timeLimit || !this.progress.startedAt) {
      return null
    }

    const elapsedSeconds = Math.floor(
      (new Date().getTime() - this.progress.startedAt.getTime()) / 1000
    )

    return Math.max(0, currentDecision.timeLimit - elapsedSeconds)
  }

  /**
   * Get hint for current decision (costs score penalty)
   */
  getHint(): string | null {
    const currentDecision = this.getCurrentDecision()
    if (!currentDecision) return null

    // Find the option with highest skill points as a hint
    const bestOption = currentDecision.options.reduce((best, current) => {
      const currentPoints = current.outcomes.skillPoints?.reduce((sum, sp) => sum + sp.points, 0) || 0
      const bestPoints = best.outcomes.skillPoints?.reduce((sum, sp) => sum + sp.points, 0) || 0
      return currentPoints > bestPoints ? current : best
    })

    // Apply small score penalty for using hint
    if (this.progress.score !== undefined) {
      this.progress.score = Math.max(0, this.progress.score - 5)
    }

    return bestOption.analysis.reasoning
  }
}

/**
 * Scenario Manager - Loads and manages multiple scenarios
 */
export class ScenarioManager {
  private scenarios: Map<string, Scenario> = new Map()

  /**
   * Load a scenario from JSON
   */
  loadScenario(scenarioData: Scenario): void {
    this.scenarios.set(scenarioData.id, scenarioData)
  }

  /**
   * Get scenario by ID
   */
  getScenario(scenarioId: string): Scenario | undefined {
    return this.scenarios.get(scenarioId)
  }

  /**
   * Get all scenarios
   */
  getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values())
  }

  /**
   * Get scenarios by category
   */
  getScenariosByCategory(category: string): Scenario[] {
    return this.getAllScenarios().filter(s => s.category === category)
  }

  /**
   * Get scenarios by difficulty
   */
  getScenariosByDifficulty(difficulty: string): Scenario[] {
    return this.getAllScenarios().filter(s => s.difficulty === difficulty)
  }

  /**
   * Get recommended scenarios based on player skills
   */
  getRecommendedScenarios(playerSkills: PlayerSkills, completedScenarioIds: string[]): Scenario[] {
    const available = this.getAllScenarios().filter(
      s => !completedScenarioIds.includes(s.id)
    )

    // Sort by relevance to player's strongest skills
    return available.sort((a, b) => {
      const aRelevance = a.skills.reduce((sum, skill) => {
        return sum + (playerSkills.skills[skill]?.level || 0)
      }, 0)
      const bRelevance = b.skills.reduce((sum, skill) => {
        return sum + (playerSkills.skills[skill]?.level || 0)
      }, 0)
      return bRelevance - aRelevance
    })
  }
}
