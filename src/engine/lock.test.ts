import { deriveAllowedKeys, displayKeys, keyFromEvent } from './lock'

const key = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init)

describe('deriveAllowedKeys', () => {
  it('allows the keys in the solution and Esc', () => {
    const allowed = deriveAllowedKeys('iBig <Esc>')
    expect([...allowed].sort()).toEqual([' ', '<Esc>', 'B', 'g', 'i'].sort())
  })

  it('allows every digit as a count when the solution has one', () => {
    const allowed = deriveAllowedKeys('4w')
    expect(allowed.has('7')).toBe(true)
    expect(allowed.has('w')).toBe(true)
    expect(allowed.has('b')).toBe(false)
  })

  it('does not allow digits when the solution has none', () => {
    expect(deriveAllowedKeys('%').has('3')).toBe(false)
  })

  it('adds extra keys', () => {
    expect(deriveAllowedKeys('cwWorld<Esc>', 'u').has('u')).toBe(true)
  })
})

describe('displayKeys', () => {
  it('lists distinct keys once', () => {
    expect(displayKeys('dd..', 'u')).toEqual(['d', '.', 'u'])
  })
})

describe('keyFromEvent', () => {
  it('maps named and printable keys', () => {
    expect(keyFromEvent(key({ key: 'Escape' }))).toBe('<Esc>')
    expect(keyFromEvent(key({ key: 'Enter' }))).toBe('<CR>')
    expect(keyFromEvent(key({ key: 'ArrowLeft' }))).toBe('<Left>')
    expect(keyFromEvent(key({ key: 'w' }))).toBe('w')
    expect(keyFromEvent(key({ key: 'W', shiftKey: true }))).toBe('W')
    expect(keyFromEvent(key({ key: 'd', ctrlKey: true }))).toBe('<C-d>')
  })

  it('ignores modifiers and browser shortcuts', () => {
    expect(keyFromEvent(key({ key: 'Shift' }))).toBeNull()
    expect(keyFromEvent(key({ key: 'r', metaKey: true }))).toBeNull()
  })

  it('passes dead keys through so they can be blocked', () => {
    expect(keyFromEvent(key({ key: 'Dead' }))).toBe('Dead')
  })
})
