import type { AdvisorPersona, StartupMetrics, MarketConditions } from '@/lib/types/database.types'
import { getChatCompletion, type ChatMessage } from './openai'
import ceoPerson from '@/data/personas/ceo.json'
import ctoPerson from '@/data/personas/cto.json'
import cfoPerson from '@/data/personas/cfo.json'
import cmoPerson from '@/data/personas/cmo.json'
import investorPerson from '@/data/personas/investor.json'

export interface PersonaConfig {
  id: string
  name: string
  title: string
  avatar: string
  expertise: string[]
  personality: string
  background: string
  advice_style: string
  communication_tone: string
  key_phrases: string[]
  priorities: string[]
  red_flags: string[]
  when_to_ask: string[]
}

export interface AdvisorContext {
  startupName: string
  industry: string
  metrics: StartupMetrics
  market: MarketConditions
  recentEvents?: string[]
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export class PersonaEngine {
  private personas: Map<AdvisorPersona, PersonaConfig>

  constructor() {
    this.personas = new Map([
      ['ceo', ceoPerson as PersonaConfig],
      ['cto', ctoPerson as PersonaConfig],
      ['cfo', cfoPerson as PersonaConfig],
      ['cmo', cmoPerson as PersonaConfig],
      ['investor', investorPerson as PersonaConfig],
    ])
  }

  getPersona(type: AdvisorPersona): PersonaConfig | undefined {
    return this.personas.get(type)
  }

  getAllPersonas(): PersonaConfig[] {
    return Array.from(this.personas.values())
  }

  async getAdvice(
    persona: AdvisorPersona,
    userMessage: string,
    context: AdvisorContext
  ): Promise<string> {
    const personaConfig = this.personas.get(persona)
    if (!personaConfig) {
      throw new Error(`Unknown persona: ${persona}`)
    }

    const systemPrompt = this.buildSystemPrompt(personaConfig, context)
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history if available
    if (context.conversationHistory) {
      context.conversationHistory.forEach((msg) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })
      })
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage })

    const response = await getChatCompletion(messages, {
      temperature: 0.8, // More creative for personality
      maxTokens: 600,
    })

    return response
  }

  private buildSystemPrompt(personaConfig: PersonaConfig, context: AdvisorContext): string {
    const { metrics, market, startupName, industry } = context

    return `You are ${personaConfig.name}, ${personaConfig.title}.

BACKGROUND:
${personaConfig.background}

PERSONALITY & STYLE:
- Personality: ${personaConfig.personality}
- Advice Style: ${personaConfig.advice_style}
- Communication Tone: ${personaConfig.communication_tone}

YOUR EXPERTISE:
${personaConfig.expertise.join(', ')}

KEY PHRASES YOU USE:
${personaConfig.key_phrases.slice(0, 3).join(', ')}

YOUR PRIORITIES:
${personaConfig.priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

RED FLAGS YOU WATCH FOR:
${personaConfig.red_flags.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CURRENT STARTUP CONTEXT:
Company: ${startupName} (${industry})

METRICS:
- Burn Rate: $${metrics.burn_rate.toLocaleString()}/month
- Runway: ${metrics.runway} months
- MRR: $${metrics.mrr.toLocaleString()}/month
- Users: ${metrics.user_count.toLocaleString()}
- User Growth: ${metrics.user_growth_rate.toFixed(1)}%
- Team Size: ${metrics.team_size}
- Team Morale: ${metrics.team_morale}/100
- Product Quality: ${metrics.product_quality.toFixed(0)}/100
- Customer Satisfaction: ${metrics.customer_satisfaction}/100
- Valuation: $${metrics.valuation.toLocaleString()}

MARKET CONDITIONS:
- Market Size: $${(market.market_size / 1000000000).toFixed(1)}B
- Growth Rate: ${market.growth_rate.toFixed(1)}%
- Competition Level: ${market.competition_level.toFixed(0)}/100
- Economic Cycle: ${market.economic_cycle}
- Trends: ${market.trends.join(', ')}

${context.recentEvents && context.recentEvents.length > 0 ? `
RECENT EVENTS:
${context.recentEvents.slice(-5).join('\n')}
` : ''}

INSTRUCTIONS:
1. Stay in character as ${personaConfig.name} at all times
2. Provide specific, actionable advice based on the metrics
3. Reference the actual numbers when giving advice
4. Ask probing questions that match your personality
5. Flag any red flags you notice
6. Be concise but insightful (2-4 sentences)
7. Use your key phrases naturally when appropriate
8. Prioritize areas that match your expertise

Remember: You're a trusted advisor who's seen hundreds of startups. Be honest, direct, and focus on what will actually move the needle.`
  }

  async analyzeMetrics(
    persona: AdvisorPersona,
    context: AdvisorContext
  ): Promise<{
    concerns: string[]
    opportunities: string[]
    recommendations: string[]
  }> {
    const personaConfig = this.personas.get(persona)
    if (!personaConfig) {
      throw new Error(`Unknown persona: ${persona}`)
    }

    const analysisPrompt = `Based on the current metrics and your expertise, provide a quick analysis:

1. Top 2-3 concerns you have
2. Top 2-3 opportunities you see
3. Top 2-3 immediate recommendations

Format as JSON:
{
  "concerns": ["concern 1", "concern 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`

    const systemPrompt = this.buildSystemPrompt(personaConfig, context)
    const response = await getChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: analysisPrompt },
      ],
      { temperature: 0.5, maxTokens: 400 }
    )

    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Failed to parse advisor analysis:', error)
    }

    // Fallback
    return {
      concerns: ['Unable to analyze at this time'],
      opportunities: [],
      recommendations: [],
    }
  }

  async getDecisionRecommendation(
    persona: AdvisorPersona,
    decisionType: string,
    options: Array<{ label: string; description: string }>,
    context: AdvisorContext
  ): Promise<{
    recommendation: string
    reasoning: string
    confidence: 'low' | 'medium' | 'high'
  }> {
    const personaConfig = this.personas.get(persona)
    if (!personaConfig) {
      throw new Error(`Unknown persona: ${persona}`)
    }

    const decisionPrompt = `You're being asked for advice on a ${decisionType} decision.

OPTIONS:
${options.map((opt, i) => `${i + 1}. ${opt.label}: ${opt.description}`).join('\n')}

Recommend which option to choose and explain why. Consider the current metrics and your priorities.

Format as JSON:
{
  "recommendation": "option label",
  "reasoning": "brief explanation",
  "confidence": "low|medium|high"
}`

    const systemPrompt = this.buildSystemPrompt(personaConfig, context)
    const response = await getChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: decisionPrompt },
      ],
      { temperature: 0.6, maxTokens: 300 }
    )

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Failed to parse decision recommendation:', error)
    }

    // Fallback
    return {
      recommendation: options[0]?.label || 'Unknown',
      reasoning: 'Unable to provide recommendation at this time',
      confidence: 'low',
    }
  }

  // Proactive alerts - advisor reaches out when they notice something
  async checkForProactiveAdvice(
    persona: AdvisorPersona,
    context: AdvisorContext
  ): Promise<string | null> {
    const personaConfig = this.personas.get(persona)
    if (!personaConfig) return null

    const { metrics } = context

    // Check for red flag conditions based on persona
    const triggers: Record<AdvisorPersona, () => boolean> = {
      ceo: () =>
        metrics.runway < 3 ||
        metrics.user_growth_rate < 5 ||
        metrics.team_morale < 50,
      cto: () =>
        metrics.product_quality < 40 ||
        metrics.team_size > 20,
      cfo: () =>
        metrics.runway < 6 ||
        metrics.burn_rate > metrics.mrr * 3 ||
        metrics.mrr === 0,
      cmo: () =>
        metrics.user_growth_rate < 5 ||
        metrics.customer_satisfaction < 50,
      investor: () =>
        metrics.runway < 6 ||
        metrics.user_growth_rate < 10 ||
        metrics.market_share < 0.1,
    }

    const shouldReachOut = triggers[persona]?.()

    if (!shouldReachOut) return null

    // Generate proactive message
    const proactivePrompt = `You notice something concerning in the metrics. Reach out proactively with a brief, urgent message (1-2 sentences) about what you're seeing and why it matters.`

    const systemPrompt = this.buildSystemPrompt(personaConfig, context)
    const response = await getChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: proactivePrompt },
      ],
      { temperature: 0.8, maxTokens: 150 }
    )

    return response
  }
}
