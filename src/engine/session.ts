import { Compartment, EditorState, type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Vim, getCM, vim } from '@replit/codemirror-vim'
import type { SessionState } from './checks'
import { parseKeys } from './keys'
import { keyFromEvent } from './lock'
import { lineNumberExtension } from './lineNumbers'
import type { Mode, NumberOptions } from '../exercises/types'

export interface SessionOptions {
  parent?: HTMLElement
  content: string
  /** 1-indexerat, som i vim. */
  start: { line: number; col: number }
  extensions?: Extension[]
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

/** Inmatningssätt som aldrig är tangenttryck. IME-komposition och tryck-och-håll hamnar här. */
const BLOCKED_USER_EVENTS = ['input.paste', 'input.drop', 'input.type.compose', 'delete.cut', 'delete.dragged']

/** Stoppar webbläsarens standardåtgärd och markerar händelsen som hanterad för CodeMirror. */
const block = (event: Event) => {
  event.preventDefault()
  return true
}

/**
 * Låser musen och andra inmatningssätt än tangentbordet i övningsläge. DOM-
 * händelserna stoppas först, och transaktionsfiltret fångar det som ändå tar sig
 * förbi (komposition, webbläsarens egna redigeringsåtgärder).
 */
const lockedInput: Extension = [
  EditorView.domEventHandlers({
    mousedown(event, view) {
      event.preventDefault()
      view.focus()
      return true
    },
    dblclick: block,
    dragstart: block,
    drop: block,
    paste: block,
    cut: block,
  }),
  EditorState.transactionFilter.of((transaction) =>
    BLOCKED_USER_EVENTS.some((event) => transaction.isUserEvent(event)) ? [] : transaction,
  ),
]

/** Vim-pluginets editorobjekt. Kastar ett tydligt fel om pluginet inte kopplades på. */
function requireVim(view: EditorView) {
  const cm = getCM(view)
  if (!cm) {
    view.destroy()
    throw new Error('The vim extension did not attach to the editor')
  }
  return cm
}

export function createSession(options: SessionOptions): Session {
  const { content, start, extensions = [] } = options

  const initialNumberOptions: NumberOptions = { number: true, relativenumber: true }
  const numberOptions: NumberOptions = { ...initialNumberOptions }
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
  const cm = requireVim(view)
  const applyNumberOptions = () => {
    if (options.lineNumbers) {
      view.dispatch({ effects: numbers.reconfigure(lineNumberExtension(numberOptions)) })
    }
  }
  optionHandlers.set(cm, (name, value) => {
    numberOptions[name] = value
    applyNumberOptions()
    notify()
  })
  const getMode = (): Mode => {
    const state = cm.state.vim
    if (state?.insertMode) return 'insert'
    if (state?.visualMode) return 'visual'
    return 'normal'
  }

  const promptInput = () => view.dom.querySelector('input')

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
    Object.assign(numberOptions, initialNumberOptions)
    applyNumberOptions()
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
