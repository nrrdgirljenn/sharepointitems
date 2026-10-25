/** One message this session sent to, or got from, another session. */
export type TeamMessage = {
  id: string
  direction: 'in' | 'out'
  /** The other session: who it went to, or who sent it. */
  who: string
  firstLine: string
  /** Milliseconds since the epoch. */
  at: number
  /** Set when the message belongs to a /standup round. */
  standup?: 'ask' | 'reply'
}

/** The latest /standup round: who was asked, and their replies so far. */
export type Standup = {
  startedAt: number
  asked: { name: string; reply?: string; failed?: string }[]
}

declare module 'claude-code' {
  interface PluginState {
    'team-room': {
      messages: Shaped<TeamMessage[]>
      standup: Shaped<Standup | null>
    }
  }
}
