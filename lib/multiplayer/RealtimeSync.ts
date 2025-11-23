import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/utils/supabase/client'

export type RealtimeEvent =
  | 'player:joined'
  | 'player:left'
  | 'player:action'
  | 'competition:started'
  | 'competition:ended'
  | 'market:update'
  | 'player:eliminated'

export interface RealtimeMessage {
  event: RealtimeEvent
  payload: any
  timestamp: number
  senderId?: string
}

export class RealtimeSync {
  private channel: RealtimeChannel | null = null
  private competitionId: string
  private userId: string
  private handlers: Map<RealtimeEvent, Set<(payload: any) => void>>

  constructor(competitionId: string, userId: string) {
    this.competitionId = competitionId
    this.userId = userId
    this.handlers = new Map()
  }

  async connect(): Promise<void> {
    const supabase = createClient()

    // Create channel for this competition
    this.channel = supabase.channel(`competition:${this.competitionId}`, {
      config: {
        broadcast: {
          self: true, // Receive own messages for confirmation
        },
        presence: {
          key: this.userId,
        },
      },
    })

    // Set up presence tracking
    this.channel
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel!.presenceState()
        this.handlePresenceUpdate(state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.emit('player:joined', { playerId: key, presences: newPresences })
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.emit('player:left', { playerId: key, presences: leftPresences })
      })

    // Set up broadcast listeners
    this.channel.on('broadcast', { event: 'player_action' }, ({ payload }) => {
      this.emit('player:action', payload)
    })

    this.channel.on('broadcast', { event: 'competition_update' }, ({ payload }) => {
      const event = payload.type as RealtimeEvent
      this.emit(event, payload.data)
    })

    // Subscribe with presence
    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.channel!.track({
          user_id: this.userId,
          online_at: new Date().toISOString(),
        })
      }
    })
  }

  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.unsubscribe()
      this.channel = null
    }
  }

  // Event handling
  on(event: RealtimeEvent, handler: (payload: any) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
  }

  off(event: RealtimeEvent, handler: (payload: any) => void): void {
    this.handlers.get(event)?.delete(handler)
  }

  private emit(event: RealtimeEvent, payload: any): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(payload))
    }
  }

  // Broadcasting
  async broadcast(event: RealtimeEvent, payload: any): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to realtime channel')
    }

    const message: RealtimeMessage = {
      event,
      payload,
      timestamp: Date.now(),
      senderId: this.userId,
    }

    await this.channel.send({
      type: 'broadcast',
      event: 'competition_update',
      payload: {
        type: event,
        data: payload,
        sender: this.userId,
      },
    })
  }

  async sendAction(action: any): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to realtime channel')
    }

    await this.channel.send({
      type: 'broadcast',
      event: 'player_action',
      payload: {
        ...action,
        playerId: this.userId,
        timestamp: Date.now(),
      },
    })
  }

  // Presence
  private handlePresenceUpdate(state: any): void {
    const playerIds = Object.keys(state)
    // Emit presence update
    this.emit('player:joined', { activePlayers: playerIds })
  }

  getOnlinePlayers(): string[] {
    if (!this.channel) return []

    const state = this.channel.presenceState()
    return Object.keys(state)
  }

  isConnected(): boolean {
    return this.channel !== null
  }
}

// Competition room manager
class CompetitionRoomManager {
  private rooms: Map<string, RealtimeSync>

  constructor() {
    this.rooms = new Map()
  }

  async join(competitionId: string, userId: string): Promise<RealtimeSync> {
    const key = `${competitionId}:${userId}`

    if (this.rooms.has(key)) {
      return this.rooms.get(key)!
    }

    const room = new RealtimeSync(competitionId, userId)
    await room.connect()

    this.rooms.set(key, room)
    return room
  }

  async leave(competitionId: string, userId: string): Promise<void> {
    const key = `${competitionId}:${userId}`
    const room = this.rooms.get(key)

    if (room) {
      await room.disconnect()
      this.rooms.delete(key)
    }
  }

  get(competitionId: string, userId: string): RealtimeSync | undefined {
    const key = `${competitionId}:${userId}`
    return this.rooms.get(key)
  }
}

// Singleton
let managerInstance: CompetitionRoomManager | null = null

export function getCompetitionRoomManager(): CompetitionRoomManager {
  if (!managerInstance) {
    managerInstance = new CompetitionRoomManager()
  }
  return managerInstance
}
