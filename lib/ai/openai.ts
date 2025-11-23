import OpenAI from 'openai'

let openaiInstance: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables')
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function getChatCompletion(
  messages: ChatMessage[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<string> {
  const client = getOpenAIClient()

  const response = await client.chat.completions.create({
    model: options.model || 'gpt-4o-mini',
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 500,
  })

  return response.choices[0]?.message?.content || ''
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<void> {
  const client = getOpenAIClient()

  const stream = await client.chat.completions.create({
    model: options.model || 'gpt-4o-mini',
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 500,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      onChunk(content)
    }
  }
}
