import { displayKeys, isAltGr, keyFromEvent, prettyKey, taughtKeys } from './lock'

const key = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init)

describe('taughtKeys', () => {
  it('keeps the command keys of the solution and Esc, not the text typed in insert mode', () => {
    expect([...taughtKeys('iBig <Esc>')].sort()).toEqual(['<Esc>', 'i'].sort())
    expect([...taughtKeys('cwWorld<Esc>')].sort()).toEqual(['<Esc>', 'c', 'w'].sort())
  })

  it('keeps only the keys around a prompt, not what is typed in it', () => {
    expect([...taughtKeys(':set number<CR>', ':set relativenumber<CR>')].sort()).toEqual(['<CR>', '<Esc>', ':'].sort())
  })

  it('allows every digit as a count when the solution has one', () => {
    const taught = taughtKeys('4w')
    expect(taught.has('7')).toBe(true)
    expect(taught.has('w')).toBe(true)
    expect(taught.has('b')).toBe(false)
  })

  it('does not allow digits when the solution has none', () => {
    expect(taughtKeys('%').has('3')).toBe(false)
  })

  it('adds extra command keys', () => {
    expect(taughtKeys('cwWorld<Esc>', 'u').has('u')).toBe(true)
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

  it('names dead keys so the lock can let them through to the plugin', () => {
    expect(keyFromEvent(key({ key: 'Dead' }))).toBe('Dead')
  })

  it('reads AltGr (Ctrl+Alt on Windows) and a lone Alt (Mac) as the plain character', () => {
    const altGr = key({ key: '{', ctrlKey: true, altKey: true })
    expect(isAltGr(altGr)).toBe(true)
    expect(keyFromEvent(altGr)).toBe('{')
    expect(keyFromEvent(key({ key: '$', altKey: true }))).toBe('$')
    expect(isAltGr(key({ key: 'd', ctrlKey: true }))).toBe(false)
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
