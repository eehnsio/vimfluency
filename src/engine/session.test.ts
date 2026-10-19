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
    expect(s.getState()).toMatchObject({
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
    const s = createSession({
      parent: document.body,
      content: 'a\nb\nc\nd',
      start: { line: 2, col: 1 },
      lineNumbers: true,
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

  it('turns line numbers off and on with :set, like vim', () => {
    const s = createSession({
      parent: document.body,
      content: 'a\nb',
      start: { line: 1, col: 1 },
      lineNumbers: true,
    })
    session = s
    const gutter = () => s.view.dom.querySelector('.cm-lineNumbers')
    // Första elementet är CodeMirrors osynliga breddmall, inte en rad.
    const numbers = () =>
      [...s.view.dom.querySelectorAll('.cm-lineNumbers .cm-gutterElement')].slice(1).map((el) => el.textContent)
    expect(gutter()).not.toBeNull()
    expect(s.getState().options).toEqual({ number: true, relativenumber: true })

    // Bara relativenumber kvar: relativa nummer med 0 på aktuell rad.
    s.sendKeys(':set nonumber<CR>')
    expect(s.getState().options.number).toBe(false)
    expect(numbers()).toEqual(['0', '1'])

    s.sendKeys(':set norelativenumber<CR>')
    expect(gutter()).toBeNull()

    s.sendKeys(':set number<CR>')
    expect(gutter()).not.toBeNull()
    expect(numbers()).toEqual(['1', '2'])
  })

  it('starts with the given line numbers and keeps new ones as the reset baseline', () => {
    const s = createSession({
      parent: document.body,
      content: 'a\nb',
      start: { line: 1, col: 1 },
      lineNumbers: true,
      numberOptions: { number: false, relativenumber: false },
    })
    session = s
    expect(s.view.dom.querySelector('.cm-lineNumbers')).toBeNull()

    s.setNumberOptions({ number: true, relativenumber: false })
    expect(s.getState().options).toEqual({ number: true, relativenumber: false })
    s.sendKeys(':set nonumber<CR>')
    s.reset()
    expect(s.getState().options).toEqual({ number: true, relativenumber: false })
  })

  it('restores the line number options and the gutter on reset', () => {
    const s = createSession({
      parent: document.body,
      content: 'a\nb',
      start: { line: 1, col: 1 },
      lineNumbers: true,
    })
    session = s
    s.sendKeys(':set nonumber<CR>:set norelativenumber<CR>')
    expect(s.view.dom.querySelector('.cm-lineNumbers')).toBeNull()

    s.reset()
    expect(s.getState().options).toEqual({ number: true, relativenumber: true })
    expect(s.view.dom.querySelector('.cm-lineNumbers')).not.toBeNull()
  })

  it('switches between relative and absolute numbers with :set norelativenumber', () => {
    const s = createSession({
      parent: document.body,
      content: 'a\nb\nc',
      start: { line: 1, col: 1 },
      lineNumbers: true,
    })
    session = s
    s.sendKeys(':set norelativenumber<CR>')
    const numbers = [...s.view.dom.querySelectorAll('.cm-lineNumbers .cm-gutterElement')]
      .map((el) => el.textContent)
      .slice(-3)
    expect(numbers).toEqual(['1', '2', '3'])
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

  it('lets Tab move focus out of the editor in normal mode, without reaching vim', () => {
    const { s, onBlocked } = locked('abc', ['i'])
    for (const shiftKey of [false, true]) {
      const event = press(s.view.contentDOM, { key: 'Tab', shiftKey })
      expect(event.defaultPrevented).toBe(false) // webbläsaren flyttar fokus
    }
    expect(onBlocked).not.toHaveBeenCalled()

    // I insert-läge är Tab ett tecken och följer låset som vanligt.
    press(s.view.contentDOM, { key: 'i' })
    press(s.view.contentDOM, { key: 'Tab' })
    expect(onBlocked).toHaveBeenCalledWith('<Tab>')
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

  it('rejects pasted, dropped and cut text even when the DOM events are bypassed', () => {
    const { s } = locked('abc', ['w'])
    for (const userEvent of ['input.paste', 'input.drop', 'delete.cut', 'delete.dragged']) {
      s.view.dispatch({ changes: { from: 0, insert: 'X' }, userEvent })
    }
    expect(s.getState().content).toBe('abc')
  })

  it("lets the vim plugin's own edits through while locked (cw, dd, x)", () => {
    const { s } = locked('const a = Hello', ['c', 'w', 'W', 'o', 'r', 'l', 'd', 'x'])
    s.sendKeys('3wcwWorld<Esc>')
    expect(s.getState().content).toBe('const a = World')
    s.sendKeys('x')
    expect(s.getState().content).toBe('const a = Worl')
  })

  it('still applies programmatic changes and typed text while locked', () => {
    const { s } = locked('abc', ['i'])
    s.view.dispatch({ changes: { from: 0, insert: 'X' } })
    s.view.dispatch({ changes: { from: 0, insert: 'Y' }, userEvent: 'input.type' })
    expect(s.getState().content).toBe('YXabc')
  })

  it('does not filter transactions when the session is not locked', () => {
    open('abc')
    session!.view.dispatch({ changes: { from: 0, insert: 'X' }, userEvent: 'input.paste' })
    expect(session!.getState().content).toBe('Xabc')
  })

  it('treats r as the emergency exit even when the solution contains an r', () => {
    const { s, onBlocked } = locked('hello', ['c', 'w', 'r', 'd', 'W', 'o', 'l'])
    press(s.view.contentDOM, { key: 'r' })
    expect(onBlocked).toHaveBeenCalledWith('r')
  })

  it('still types r in insert mode and in prompts', () => {
    const { s, onBlocked } = locked('hello', ['i', 'r', ':'])
    s.sendKeys('i')
    press(s.view.contentDOM, { key: 'r' })
    s.sendKeys('<Esc>:')
    press(s.view.dom.querySelector('input')!, { key: 'r' })
    expect(onBlocked).not.toHaveBeenCalled()
  })

  it('closes an open prompt on reset', () => {
    // `<Esc>` är alltid tillåten i appen (`deriveAllowedKeys`), och reset stänger prompten med den.
    const { s } = locked('hello', [':', '<Esc>'])
    s.sendKeys(':')
    expect(s.view.dom.querySelector('input')).not.toBeNull()
    s.reset()
    expect(s.view.dom.querySelector('input')).toBeNull()
  })

  it('notifies listeners even when a key makes the plugin throw', () => {
    const s = open('abc')
    const listener = vi.fn()
    s.subscribe(listener)
    // Ett tangentnamn pluginet inte känner igen, efter en giltig tangent.
    vi.spyOn(s.view.dom, 'querySelector').mockImplementation(() => {
      throw new Error('boom')
    })
    expect(() => s.sendKeys('w')).toThrow('boom')
    expect(listener).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('leaves sendKeys unrestricted so reference solutions can run', () => {
    const { s } = locked('foo bar', ['w'])
    s.sendKeys('e')
    expect(s.getState().cursor.col).toBe(3)
  })
})
