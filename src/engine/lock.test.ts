import { deriveAllowedKeys, displayKeys, keyFromEvent, prettyKey } from './lock'

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
    expect(displayKeys('w2w')).toEqual(['w', '0-9'])
  })

  it('shows doubled commands as one key', () => {
    expect(displayKeys('dd..', 'u')).toEqual(['dd', '.', 'u'])
    expect(displayKeys('gg')).toEqual(['gg'])
  })

  it('shows counts as one chip', () => {
    expect(displayKeys('2j12l', 'hk')).toEqual(['0-9', 'j', 'l', 'h', 'k'])
  })

  it('leaves out what is typed in insert mode', () => {
    expect(displayKeys('cwWorld<Esc>', 'u')).toEqual(['c', 'w', 'Esc', 'u'])
    expect(displayKeys("ci'Update name<Esc>")).toEqual(['c', 'i', "'", 'Esc'])
    expect(displayKeys("oimport { useMemo } from 'react'<Esc>")).toEqual(['o', 'Esc'])
    expect(displayKeys('S<section>New</section><Esc>')).toEqual(['S', 'Esc'])
  })

  it('leaves out what is typed in a prompt', () => {
    expect(displayKeys(':%s/count/total/g<CR>')).toEqual([':', 'Enter'])
    expect(displayKeys('/NOTE<CR>nn')).toEqual(['/', 'Enter', 'n'])
  })

  it('keeps the arguments of motions, operators and visual text objects', () => {
    expect(displayKeys('dt)')).toEqual(['d', 't', ')'])
    expect(displayKeys('fw')).toEqual(['f', 'w'])
    expect(displayKeys('vi(d')).toEqual(['v', 'i', '(', 'd'])
    expect(displayKeys('Vjd')).toEqual(['V', 'j', 'd'])
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

describe('prettyKey', () => {
  it('writes keys the way you would say them', () => {
    expect(prettyKey('<Right>')).toBe('→')
    expect(prettyKey('<CR>')).toBe('Enter')
    expect(prettyKey('<C-d>')).toBe('Ctrl-d')
    expect(prettyKey(' ')).toBe('Space')
    expect(prettyKey('x')).toBe('x')
  })
})
