import { Compartment, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Vim, getCM, vim } from '@replit/codemirror-vim'
import type { EditorState as SessionState } from './checks'
import { parseKeys } from './keys'
import { keyFromEvent } from './lock'
import { lineNumberExtension, type NumberOptions } from './lineNumbers'
import type { Mode } from '../exercises/types'

export interface SessionOptions {
  parent?: HTMLElement
  content: string
  /** 1-indexerat, som i vim. */
  start: { line: number; col: number }
  extensions?: import('@codemirror/state').Extension[]
  /** Visa radnummer och aktiv rad. Styrs av `:set number` och `:set relativenumber`. */
  lineNumbers?: boolean
  /**
   * Om satt är bara dessa tangenter (notation som i `parseKeys`) tillåtna från
   * användaren, och mus, klistra in och drag låses. `sendKeys` påverkas inte.
   */
  allowedKeys?: ReadonlySet<string>
  /** Anropas med tangenten när en låst tangent trycks. */
  onBlocked?: (key: string) => void
}

export interface Session {
  view: EditorView
  sendKeys(notation: string): void
  getState(): SessionState
  reset(): void
  /** Anropas när innehåll, markör, läge eller läge kan ha ändrats. */
  subscribe(listener: () => void): () => void
  destroy(): void
}

type OptionName = keyof NumberOptions

// Vims alternativ är globala men värdet kommer med en editor (`cm`). Sessionen
// registrerar sig här så att `:set nonumber` hamnar hos rätt editor.
const optionHandlers = new WeakMap<object, (name: OptionName, value: boolean) => void>()

function defineToggle(name: OptionName, aliases: string[]) {
  Vim.defineOption(name, true, 'boolean', aliases, (value: unknown, cm?: object) => {
    if (cm && typeof value === 'boolean') optionHandlers.get(cm)?.(name, value)
  })
}
defineToggle('number', ['nu'])
defineToggle('relativenumber', ['rnu'])

/** Låser musen och andra inmatningssätt än tangentbordet i övningsläge. */
const lockedInput = EditorView.domEventHandlers({
  mousedown(event, view) {
    event.preventDefault()
    view.focus()
    return true
  },
  dblclick: (event) => (event.preventDefault(), true),
  dragstart: (event) => (event.preventDefault(), true),
  drop: (event) => (event.preventDefault(), true),
  paste: (event) => (event.preventDefault(), true),
  cut: (event) => (event.preventDefault(), true),
})

export function createSession(options: SessionOptions): Session {
  const { content, start, extensions = [] } = options

  const numberOptions: NumberOptions = { number: true, relativenumber: true }
  const numbers = new Compartment()
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())

  const view = new EditorView({
    state: EditorState.create({
      doc: content,
      extensions: [
        vim(),
        EditorView.updateListener.of(notify),
        ...(options.allowedKeys ? [lockedInput] : []),
        numbers.of(options.lineNumbers ? lineNumberExtension(numberOptions) : []),
        ...extensions,
      ],
    }),
    parent: options.parent ?? document.createElement('div'),
  })
  const cm = getCM(view)!
  optionHandlers.set(cm, (name, value) => {
    numberOptions[name] = value
    if (options.lineNumbers) {
      view.dispatch({ effects: numbers.reconfigure(lineNumberExtension(numberOptions)) })
    }
    notify()
  })
  const { allowedKeys, onBlocked } = options
  const onLockedKeyDown = (event: KeyboardEvent) => {
    if (!allowedKeys) return
    const key = keyFromEvent(event)
    if (key === null || allowedKeys.has(key)) return
    // Man ska alltid kunna sudda när man skrivit fel, i insert-läge och i prompter.
    if (key === '<BS>' && (getMode() === 'insert' || promptInput())) return
    event.preventDefault()
    event.stopPropagation()
    onBlocked?.(key)
  }
  view.dom.addEventListener('keydown', onLockedKeyDown, true)
  // keyup kommer efter att pluginet hanterat tangenten, så läget är uppdaterat.
  view.dom.addEventListener('keyup', notify, true)
  cm.on('vim-mode-change', notify)

  const placeCursor = () => cm.setCursor(start.line - 1, start.col - 1)
  placeCursor()

  const getMode = (): Mode => {
    const state = cm.state.vim
    if (state?.insertMode) return 'insert'
    if (state?.visualMode) return 'visual'
    return 'normal'
  }

  const promptInput = () => view.dom.querySelector('input')

  const insertText = (text: string) => view.dispatch(view.state.replaceSelection(text))

  const backspace = () => {
    const { from, empty } = view.state.selection.main
    if (!empty) return view.dispatch(view.state.replaceSelection(''))
    if (from > 0) view.dispatch({ changes: { from: from - 1, to: from }, selection: { anchor: from - 1 } })
  }

  const submitPrompt = (input: HTMLInputElement, key: 'Enter' | 'Escape') => {
    const keyCode = key === 'Enter' ? 13 : 27
    input.dispatchEvent(new KeyboardEvent('keydown', { key, keyCode, bubbles: true, cancelable: true }))
  }

  function sendKeys(notation: string) {
    for (const key of parseKeys(notation)) {
      const input = promptInput()
      if (input) {
        // En öppen prompt (`:`, `/`, `?`) tar emot tangenterna i sitt inputfält.
        if (key === '<CR>') submitPrompt(input, 'Enter')
        else if (key === '<Esc>') submitPrompt(input, 'Escape')
        else if (key === '<BS>') input.value = input.value.slice(0, -1)
        else input.value += key
        continue
      }

      if (getMode() === 'insert' && key !== '<Esc>' && !/^<[CSAM]-/.test(key)) {
        // Pluginet skriver inte själv in tecken via handleKey.
        if (key === '<CR>') insertText('\n')
        else if (key === '<BS>') backspace()
        else if (key === '<Tab>') insertText('\t')
        else if (key.length === 1) insertText(key)
        else Vim.handleKey(cm, key, 'user')
        continue
      }

      Vim.handleKey(cm, key, 'user')
    }
    notify()
  }

  function getState(): SessionState {
    const head = cm.getCursor()
    return {
      content: view.state.doc.toString(),
      cursor: { line: head.line + 1, col: head.ch + 1 },
      mode: getMode(),
      options: { ...numberOptions },
    }
  }

  function reset() {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: content } })
    Vim.handleKey(cm, '<Esc>', 'user')
    placeCursor()
    notify()
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function destroy() {
    listeners.clear()
    view.dom.removeEventListener('keyup', notify, true)
    view.dom.removeEventListener('keydown', onLockedKeyDown, true)
    view.destroy()
  }

  return { view, sendKeys, getState, reset, subscribe, destroy }
}
