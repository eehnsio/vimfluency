import { createSession, type Session } from './session'

let session: Session | undefined

function open(content: string, line = 1, col = 1) {
  session = createSession({ parent: document.body, content, start: { line, col } })
  return session
}

afterEach(() => {
  session?.destroy()
  session = undefined
})

describe('session', () => {
  it('starts at the given position in normal mode', () => {
    const s = open('abc\ndef', 2, 2)
    expect(s.getState()).toMatchObject({ cursor: { line: 2, col: 2 }, mode: 'normal' })
  })

  it('runs normal-mode motions', () => {
    const s = open('const count = 1')
    s.sendKeys('3w')
    expect(s.getState()).toMatchObject({ cursor: { line: 1, col: 15 } })
  })

  it('jumps to a matching brace with %', () => {
    const s = open('function f() {\n  return 1\n}', 1, 14)
    s.sendKeys('%')
    expect(s.getState().cursor).toEqual({ line: 3, col: 1 })
  })

  it('runs ex commands typed with : and <CR>', () => {
    const s = open('count count\ncount')
    s.sendKeys(':%s/count/total/g<CR>')
    expect(s.getState().content).toBe('total total\ntotal')
  })

  it('searches with / and <CR>', () => {
    const s = open('foo\nbar\nbaz')
    s.sendKeys('/baz<CR>')
    expect(s.getState().cursor).toEqual({ line: 3, col: 1 })
  })

  it('combines an operator with a search motion', () => {
    const s = open('foo bar baz')
    s.sendKeys('d/baz<CR>')
    expect(s.getState().content).toBe('baz')
  })

  it('types text in insert mode and returns to normal mode', () => {
    const s = open('world')
    s.sendKeys('ihello <Esc>')
    expect(s.getState()).toMatchObject({ content: 'hello world', mode: 'normal' })
  })

  it('handles <CR> and <BS> in insert mode', () => {
    const s = open('')
    s.sendKeys('iab<BS>c<CR>d<Esc>')
    expect(s.getState().content).toBe('ac\nd')
  })

  it('treats : and / as text in insert mode', () => {
    const s = open('')
    s.sendKeys('ia:b/c<Esc>')
    expect(s.getState().content).toBe('a:b/c')
  })

  it('reports visual mode', () => {
    const s = open('abc')
    s.sendKeys('v')
    expect(s.getState().mode).toBe('visual')
  })

  it('resets content, cursor and mode', () => {
    const s = open('abc def', 1, 2)
    s.sendKeys('dwi!')
    s.reset()
    expect(s.getState()).toEqual({
      content: 'abc def',
      cursor: { line: 1, col: 2 },
      mode: 'normal',
    })
  })
})

describe('session subscribe', () => {
  it('notifies after keys are sent and stops after unsubscribe', () => {
    const s = open('abc')
    const listener = vi.fn()
    const unsubscribe = s.subscribe(listener)
    s.sendKeys('l')
    expect(listener).toHaveBeenCalled()
    listener.mockClear()
    unsubscribe()
    s.sendKeys('l')
    expect(listener).not.toHaveBeenCalled()
  })
})

describe('session line numbers', () => {
  it('shows relative distances with the absolute number on the current line', async () => {
    const { relativeLineNumbers } = await import('./lineNumbers')
    const s = createSession({
      parent: document.body,
      content: 'a\nb\nc\nd',
      start: { line: 2, col: 1 },
      extensions: [relativeLineNumbers],
    })
    session = s
    const numbers = () =>
      [...s.view.dom.querySelectorAll('.cm-lineNumbers .cm-gutterElement')]
        .map((el) => el.textContent)
        .slice(-4)
    expect(numbers()).toEqual(['1', '2', '1', '2'])
    s.sendKeys('j')
    expect(numbers()).toEqual(['2', '1', '3', '1'])
  })
})

describe('session lock', () => {
  const press = (target: Element, init: KeyboardEventInit) => {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
    target.dispatchEvent(event)
    return event
  }

  const locked = (content: string, allowed: string[], onBlocked = vi.fn()) => {
    session = createSession({
      parent: document.body,
      content,
      start: { line: 1, col: 1 },
      allowedKeys: new Set(allowed),
      onBlocked,
    })
    return { s: session, onBlocked }
  }

  it('lets allowed keys through and blocks the rest', () => {
    const { s, onBlocked } = locked('foo bar baz', ['w'])
    const content = s.view.contentDOM
    expect(press(content, { key: 'w' }).defaultPrevented).toBe(true) // hanterad av vim
    expect(onBlocked).not.toHaveBeenCalled()
    expect(s.getState().cursor.col).toBe(5)

    press(content, { key: 'e' })
    expect(onBlocked).toHaveBeenCalledWith('e')
    expect(s.getState().cursor.col).toBe(5)
  })

  it('blocks arrow keys and text entry in normal mode', () => {
    const { s, onBlocked } = locked('abc', ['w'])
    press(s.view.contentDOM, { key: 'ArrowRight' })
    press(s.view.contentDOM, { key: 'x' })
    expect(onBlocked.mock.calls.map(([key]) => key)).toEqual(['<Right>', 'x'])
    expect(s.getState()).toMatchObject({ content: 'abc', cursor: { line: 1, col: 1 } })
  })

  it('always allows Backspace in insert mode and prompts, but not in normal mode', () => {
    const { s, onBlocked } = locked('abc', ['i', ':'])
    press(s.view.contentDOM, { key: 'Backspace' })
    expect(onBlocked).toHaveBeenCalledWith('<BS>')
    onBlocked.mockClear()

    press(s.view.contentDOM, { key: 'i' })
    expect(s.getState().mode).toBe('insert')
    press(s.view.contentDOM, { key: 'Backspace' })
    expect(onBlocked).not.toHaveBeenCalled()

    s.sendKeys('<Esc>:')
    press(s.view.dom.querySelector('input')!, { key: 'Backspace' })
    expect(onBlocked).not.toHaveBeenCalled()
  })

  it('does not block browser shortcuts', () => {
    const { s, onBlocked } = locked('abc', ['w'])
    const event = press(s.view.contentDOM, { key: 'r', metaKey: true })
    expect(event.defaultPrevented).toBe(false)
    expect(onBlocked).not.toHaveBeenCalled()
  })

  it('prevents mouse placement and pasting', () => {
    const { s } = locked('abc', ['w'])
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    s.view.contentDOM.dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)
    const paste = new Event('paste', { bubbles: true, cancelable: true })
    s.view.contentDOM.dispatchEvent(paste)
    expect(paste.defaultPrevented).toBe(true)
  })

  it('leaves sendKeys unrestricted so reference solutions can run', () => {
    const { s } = locked('foo bar', ['w'])
    s.sendKeys('e')
    expect(s.getState().cursor.col).toBe(3)
  })
})
