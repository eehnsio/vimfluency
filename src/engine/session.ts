import { Compartment, EditorState, type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Vim, getCM, vim } from '@replit/codemirror-vim'
import type { SessionState } from './checks'
import { parseKeys } from './keys'
import { lineNumberExtension } from './lineNumbers'
import type { NumberOptions } from '../exercises/types'
import { closePrompt, createKeyLock, feedKey, vimMode, type VimEditor } from './vimInput'

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

/**
 * Inmatningssätt som aldrig är tangenttryck. `input.type.compose` får inte stå
 * här: pluginet skickar alla sina egna redigeringar (`d`, `c`, `x`, `p`…) med
 * den, och de skulle då kastas tyst. Komposition stoppas i stället av att
 * `keydown` för IME-tangenter (`Process`) inte är tillåten.
 */
const BLOCKED_USER_EVENTS = ['input.paste', 'input.drop', 'delete.cut', 'delete.dragged']

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
      view.focus()
      return block(event)
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
function requireVim(view: EditorView): VimEditor {
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
  const { allowedKeys, onBlocked } = options
  const onLockedKeyDown = allowedKeys && createKeyLock({ view, cm, allowedKeys, onBlocked })
  if (onLockedKeyDown) view.dom.addEventListener('keydown', onLockedKeyDown, true)
  // keyup kommer efter att pluginet hanterat tangenten, så läget är uppdaterat.
  view.dom.addEventListener('keyup', notify, true)
  cm.on('vim-mode-change', notify)

  const placeCursor = () => cm.setCursor(start.line - 1, start.col - 1)
  placeCursor()

  /** `notify` körs även om pluginet kastar mitt i en sekvens, så UI:t aldrig visar gammalt tillstånd. */
  function sendKeys(notation: string) {
    try {
      for (const key of parseKeys(notation)) feedKey(view, cm, key)
    } finally {
      notify()
    }
  }

  function getState(): SessionState {
    const head = cm.getCursor()
    return {
      content: view.state.doc.toString(),
      cursor: { line: head.line + 1, col: head.ch + 1 },
      mode: vimMode(cm),
      options: { ...numberOptions },
    }
  }

  function reset() {
    closePrompt(view)
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
    if (onLockedKeyDown) view.dom.removeEventListener('keydown', onLockedKeyDown, true)
    view.destroy()
  }

  return { view, sendKeys, getState, reset, subscribe, destroy }
}
