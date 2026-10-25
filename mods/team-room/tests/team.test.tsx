import { expect, test } from 'claude-code/testing'

const PANE = {
  plugin: 'team-room',
  component: 'Pane',
  requestId: 'team',
  props: {
    title: 'Team',
    isFocused: false,
    bodyColumns: 80,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 30 },
    view: {},
  },
} as const

const LISTING = {
  listing: 'This session is home [aaa111] — the name other sessions use.',
  sections: [
    { kind: 'sessions', total: 2, rows: [{ name: 'api' }, { name: 'web' }] },
  ],
}

test('/team-standup asks each session and shows replies as they come', async ($, on) => {
  const sent: { to: string; text: string }[] = []
  on('clock.now', () => ({ value: Date.UTC(2026, 9, 25, 9, 30) }))
  on('command.register', () => ({ value: { command: 'x' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('tool.call', () => ({ result: LISTING }))
  on('session.send', (_, e) => {
    sent.push({ to: e.to, text: e.text })
    return { isDelivered: true }
  })
  on('session.receive', (_, e) => ({ text: e.text }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run({
    command: 'team-standup',
    args: '',
    origin: { kind: 'composer' },
    presentation: { isFullscreen: true, columns: 120 },
  })

  expect(sent.map(s => s.to)).toEqual(['api', 'web'])
  expect(sent[0]?.text).toContain('[standup:api]')
  expect(sent[0]?.text).toContain('SendMessage to "home"')

  await $.session.receive({
    origin: { kind: 'peer' },
    text: '[standup:api] Finished the auth fix; next is rate limits.',
  })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /Finished the auth fix/ }))).toBeTruthy()
  expect((await ui.find({ type: 'Text', text: /waiting/ }))).toBeTruthy()
  await ui.unmount()
})

test('model sends and peer messages are listed newest first', async ($, on) => {
  let now = Date.UTC(2026, 9, 25, 9, 0)
  on('clock.now', () => ({ value: (now += 60_000) }))
  on('session.send', () => ({ isDelivered: true }))
  on('session.receive', (_, e) => ({ text: e.text }))

  await $.session.send({
    to: 'api',
    text: 'Can you rebase?\nmore detail',
    origin: { kind: 'model' },
  })
  await $.session.receive({
    origin: { kind: 'peer' },
    text: '<msg from="api">\nDone, rebased.\n</msg>',
  })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  const texts = (await ui.findAll({ type: 'Text' })).map(t => t.text).join('\n')
  expect(texts.indexOf('Done, rebased.')).toBeLessThan(texts.indexOf('Can you rebase?'))
  expect(texts).not.toContain('more detail')
  await ui.unmount()
})
