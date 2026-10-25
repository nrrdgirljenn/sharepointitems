import { atom, read, update } from 'claude-code'
import type { Register, StateDollar } from 'claude-code'

import type { Standup, TeamMessage } from '../types'

const PANE = 'team'
const TITLE = 'Team'
const ME = 'team-room'
// /standup belongs to the engineering plugin, so this one is /team-standup.
const STANDUP = 'team-standup'
const KEEP = 500

// $.state outlives a reload, so the pane's history survives one.
// Change a tag when that value's fields change.
const messages = atom({ plugin: 'team-room', key: 'messages' } as const, [], {
  shape: 'messages-1',
})
const standup = atom({ plugin: 'team-room', key: 'standup' } as const, null, {
  shape: 'standup-1',
})

const TAG = /\[standup:([^\]\n]+)\]\s*/

// The first line a person would read: envelope tags and blank lines skipped.
function firstLineOf(text: string): string {
  const lines = text
    .replace(TAG, '')
    .split('\n')
    .map(line => line.replace(/<[^>]*>/g, '').trim())
    .filter(line => line.length > 0)
  const line = lines[0] ?? '(empty)'

  return line.length > 160 ? `${line.slice(0, 157)}...` : line
}

// Received text carries no sender field, so look for one in its envelope.
function senderOf(text: string): string | undefined {
  const match =
    text.match(/\bfrom\s*=\s*"([^"]+)"/i) ??
    text.match(/\bfrom\s*=\s*'([^']+)'/i) ??
    text.match(/^\s*from:\s*(.+)$/im)

  return match?.[1]?.trim()
}

function clockTime(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

type Peer = { name: string; address: string }

// Other sessions, read from the ListAgents tool. Subagents and teammates
// of this session are left out: only sessions count.
function peersOf(result: unknown): { me?: string; peers: Peer[] } {
  const r = (result ?? {}) as {
    listing?: string
    sections?: {
      kind: string
      rows: { name?: string; ref?: string; id?: string }[]
    }[]
  }
  const me = r.listing?.match(/This session is (.+?) \[/)?.[1]
  const sections = r.sections ?? []
  const sessionSections = sections.filter(s => /session|peer|remote/i.test(s.kind))
  const chosen =
    sessionSections.length > 0
      ? sessionSections
      : sections.filter(s => !/agent|teammate|task|background/i.test(s.kind))
  const peers: Peer[] = []

  for (const section of chosen) {
    for (const row of section.rows) {
      if (!row.name) continue
      const address = row.ref ? `${row.name} [${row.ref}]` : row.name
      peers.push({ name: row.name, address })
    }
  }

  return { me, peers }
}

// Newest first, so the pane reads top down.
function log($: StateDollar, entry: Omit<TeamMessage, 'id'>) {
  return update($, messages, list =>
    [{ ...entry, id: `${entry.at}-${Math.random()}` }, ...list].slice(0, KEEP),
  )
}

export const register: Register = on => {

  on('session.start', async ($, e, next) => {
    // Each on its own: a name another plugin holds is refused, and that
    // must not cost the other command.
    const commands = [
      { name: 'team', description: 'Open the Team pane: messages to and from your other sessions' },
      { name: STANDUP, description: 'Ask each of your other sessions for a one-line update' },
    ]
    for (const command of commands) {
      try {
        await $.command.register(command)
      } catch (error) {
        $.ui.toast(`team-room: /${command.name} not added: ${String(error)}`)
      }
    }

    return next(e)
  })

  on('command.run', { command: 'team' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })

    return { text: 'Team pane opened.' }
  })
    .catch(() => ({ text: 'team-room could not open the Team pane.' }))

  on('command.run', { command: 'team-standup' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })

    const listed = await $.tool.call({ tool: 'ListAgents' })
    const { me, peers } = peersOf('result' in listed ? listed.result : undefined)

    if (peers.length === 0) {
      return { text: 'No other sessions are running, so nobody was asked.' }
    }

    const startedAt = await $.clock.now()
    const round: Standup = {
      startedAt,
      asked: peers.map(p => ({ name: p.name })),
    }
    await update($, standup, () => round)

    const replyTo = me ? `SendMessage to "${me}"` : 'SendMessage to the session that sent this'
    let sent = 0

    for (const peer of peers) {
      const text =
        `Standup: please send a one-line update (what you finished, what's next).\n` +
        `Reply with ${replyTo}, one line, starting with [standup:${peer.name}]`
      const result = await $.session.send({ to: peer.address, text })
      const at = await $.clock.now()

      if (result.isDelivered) {
        sent += 1
        await log($, {
          direction: 'out',
          who: peer.name,
          firstLine: firstLineOf(text),
          at,
          standup: 'ask',
        })
      } else {
        await update($, standup, s =>
          s && s.startedAt === startedAt
            ? {
                ...s,
                asked: s.asked.map(a =>
                  a.name === peer.name ? { ...a, failed: result.reason } : a,
                ),
              }
            : s,
        )
      }
    }

    return {
      text: `Asked ${sent} of ${peers.length} sessions for a standup. Replies show in the Team pane.`,
    }
  })
    .catch(() => ({ text: 'team-room could not run the standup.' }))

  // Outgoing: the model's own SendMessage calls. /standup logs its own.
  on('session.send', async ($, e, next) => {
    const result = await next(e)

    if (e.agentId === undefined && !(e.origin?.kind === 'plugin' && e.origin.name === ME)) {
      const line = firstLineOf(e.text)
      await log($, {
        direction: 'out',
        who: e.to,
        firstLine: result.isDelivered ? line : `(not delivered) ${line}`,
        at: await $.clock.now(),
      })
    }

    return result
  }).catch(($, e, next) => next(e)) // a logging bug never blocks a send

  // Incoming: another session's message to this conversation.
  on('session.receive', async ($, e, next) => {
    const kind = e.origin.kind
    const isPeer = kind === 'peer' || kind === 'peer-send-message'

    if (!isPeer || e.agentId !== undefined) {
      return next(e)
    }

    const tagged = e.text.match(TAG)?.[1]?.trim()
    const teammate = 'teammate' in e.origin ? e.origin.teammate : undefined
    const who = tagged ?? teammate ?? senderOf(e.text) ?? 'another session'
    const firstLine = firstLineOf(e.text)
    const at = await $.clock.now()

    await log($, {
      direction: 'in',
      who,
      firstLine,
      at,
      ...(tagged ? { standup: 'reply' as const } : {}),
    })

    if (tagged) {
      await update($, standup, s =>
        s && s.asked.some(a => a.name === tagged)
          ? {
              ...s,
              asked: s.asked.map(a =>
                a.name === tagged ? { ...a, reply: firstLine, failed: undefined } : a,
              ),
            }
          : s,
      )
    }

    return next(e)
  }).catch(($, e, next) => next(e)) // a logging bug never drops a message

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const list = await read($, messages)
    const round = await read($, standup)
    const room = Math.max(3, (e.viewport?.rows ?? 30) - 4 - (round ? round.asked.length + 2 : 0))

    return (
      <Box flexDirection="column">
        {round && (
          <Box flexDirection="column" marginBottom={1}>
            <Text bold>Standup · {clockTime(round.startedAt)}</Text>
            {round.asked.map(a => (
              <Text>
                <Text bold>{a.name}</Text>{' '}
                {a.reply ? (
                  <Text>{a.reply}</Text>
                ) : a.failed ? (
                  <Text color="red">not delivered: {a.failed}</Text>
                ) : (
                  <Text dimColor>waiting…</Text>
                )}
              </Text>
            ))}
          </Box>
        )}
        {list.length === 0 && <Text dimColor>No messages with other sessions yet.</Text>}
        {list.slice(0, room).map(m => (
          <Text>
            <Text dimColor>{clockTime(m.at)}</Text>{' '}
            <Text>{m.direction === 'out' ? '→' : '←'}</Text>{' '}
            <Text bold>{m.who}</Text> {m.firstLine}
          </Text>
        ))}
      </Box>
    )
  })
}
