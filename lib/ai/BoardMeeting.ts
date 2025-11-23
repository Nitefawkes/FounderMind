import { PersonaEngine, type AdvisorContext } from './PersonaEngine'
import type { AdvisorPersona } from '@/lib/types/database.types'
import { getChatCompletion, type ChatMessage } from './openai'

export interface BoardMeetingTopic {
  title: string
  description: string
  type: 'crisis' | 'opportunity' | 'decision' | 'review'
}

export interface BoardMeetingMessage {
  id: string
  persona: AdvisorPersona | 'moderator'
  name: string
  content: string
  timestamp: number
  avatar: string
}

export class BoardMeeting {
  private personaEngine: PersonaEngine
  private context: AdvisorContext
  private attendees: AdvisorPersona[]
  private messages: BoardMeetingMessage[] = []

  constructor(
    context: AdvisorContext,
    attendees: AdvisorPersona[] = ['ceo', 'cto', 'cfo', 'cmo', 'investor']
  ) {
    this.personaEngine = new PersonaEngine()
    this.context = context
    this.attendees = attendees
  }

  async startMeeting(topic: BoardMeetingTopic): Promise<BoardMeetingMessage[]> {
    // Add opening message
    this.addMessage('moderator', 'Meeting Host', '📋',
      `Welcome to the board meeting. Today's topic: ${topic.title}\n\n${topic.description}\n\nLet's hear from our advisors.`
    )

    // Get initial reactions from each persona
    for (const persona of this.attendees) {
      const message = await this.getPersonaOpinion(persona, topic)
      const personaConfig = this.personaEngine.getPersona(persona)
      if (personaConfig) {
        this.addMessage(persona, personaConfig.name, personaConfig.avatar, message)
      }
    }

    // Generate a few rounds of discussion
    await this.conductDiscussionRound(topic)

    // Summarize and conclude
    const summary = await this.generateSummary(topic)
    this.addMessage('moderator', 'Meeting Host', '📋', summary)

    return this.messages
  }

  private async getPersonaOpinion(
    persona: AdvisorPersona,
    topic: BoardMeetingTopic
  ): Promise<string> {
    const personaConfig = this.personaEngine.getPersona(persona)
    if (!personaConfig) return ''

    const prompt = `You're in a board meeting. The topic is: "${topic.title}"\n\n${topic.description}\n\nGive your initial thoughts and recommendations (2-3 sentences). Stay in character and focus on your area of expertise.`

    try {
      return await this.personaEngine.getAdvice(persona, prompt, this.context)
    } catch (error) {
      console.error(`Failed to get opinion from ${persona}:`, error)
      return `I agree we need to address this carefully.`
    }
  }

  private async conductDiscussionRound(topic: BoardMeetingTopic): Promise<void> {
    // Pick 2-3 advisors to respond to each other
    const discussants = this.attendees.slice(0, 3)

    for (const persona of discussants) {
      // Get recent comments from other advisors
      const recentComments = this.messages
        .filter((m) => m.persona !== persona && m.persona !== 'moderator')
        .slice(-3)
        .map((m) => `${m.name}: ${m.content}`)
        .join('\n\n')

      if (!recentComments) continue

      const prompt = `Other advisors have shared their views:\n\n${recentComments}\n\nWhat's your response? Do you agree or disagree? (1-2 sentences)`

      try {
        const response = await this.personaEngine.getAdvice(persona, prompt, this.context)
        const personaConfig = this.personaEngine.getPersona(persona)
        if (personaConfig) {
          this.addMessage(persona, personaConfig.name, personaConfig.avatar, response)
        }
      } catch (error) {
        console.error(`Failed to get response from ${persona}:`, error)
      }
    }
  }

  private async generateSummary(topic: BoardMeetingTopic): Promise<string> {
    const discussion = this.messages
      .filter((m) => m.persona !== 'moderator')
      .map((m) => `${m.name}: ${m.content}`)
      .join('\n\n')

    const summaryPrompt = `Summarize the key points and recommendations from this board meeting discussion:

TOPIC: ${topic.title}

DISCUSSION:
${discussion}

Provide a concise summary with:
1. Areas of agreement
2. Areas of disagreement
3. Key action items
4. Final recommendation

Keep it brief (3-4 sentences).`

    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a professional board meeting facilitator. Summarize discussions clearly and actionably.',
        },
        {
          role: 'user',
          content: summaryPrompt,
        },
      ]

      return await getChatCompletion(messages, { temperature: 0.5, maxTokens: 300 })
    } catch (error) {
      console.error('Failed to generate summary:', error)
      return 'The board has discussed the topic and will provide recommendations shortly.'
    }
  }

  private addMessage(
    persona: AdvisorPersona | 'moderator',
    name: string,
    avatar: string,
    content: string
  ): void {
    this.messages.push({
      id: `msg_${Date.now()}_${Math.random()}`,
      persona,
      name,
      content,
      timestamp: Date.now(),
      avatar,
    })
  }

  getMessages(): BoardMeetingMessage[] {
    return [...this.messages]
  }

  // Simulate a crisis meeting
  static async emergencyMeeting(
    context: AdvisorContext,
    crisis: string
  ): Promise<BoardMeetingMessage[]> {
    const meeting = new BoardMeeting(context)
    const topic: BoardMeetingTopic = {
      title: 'Emergency: Crisis Response',
      description: crisis,
      type: 'crisis',
    }
    return await meeting.startMeeting(topic)
  }

  // Simulate a decision meeting
  static async decisionMeeting(
    context: AdvisorContext,
    decision: string,
    options: string[]
  ): Promise<BoardMeetingMessage[]> {
    const meeting = new BoardMeeting(context)
    const topic: BoardMeetingTopic = {
      title: 'Strategic Decision Required',
      description: `${decision}\n\nOptions:\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`,
      type: 'decision',
    }
    return await meeting.startMeeting(topic)
  }

  // Monthly review meeting
  static async monthlyReview(context: AdvisorContext): Promise<BoardMeetingMessage[]> {
    const { metrics } = context
    const meeting = new BoardMeeting(context)

    const performanceSummary = `
Monthly Performance Review:
- MRR: $${metrics.mrr.toLocaleString()} (Growth: ${metrics.user_growth_rate.toFixed(1)}%)
- Users: ${metrics.user_count.toLocaleString()}
- Burn Rate: $${metrics.burn_rate.toLocaleString()}/mo
- Runway: ${metrics.runway} months
- Team Morale: ${metrics.team_morale}/100

What are your thoughts on our progress? What should we focus on next month?
`

    const topic: BoardMeetingTopic = {
      title: 'Monthly Board Review',
      description: performanceSummary,
      type: 'review',
    }

    return await meeting.startMeeting(topic)
  }
}
