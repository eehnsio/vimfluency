import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Vim, getCM, vim } from '@replit/codemirror-vim'
import type { EditorState as SessionState } from './checks'
import { parseKeys } from './keys'
import type { Mode } from '../exercises/types'

export interface SessionOptions {
  parent?: HTMLElement
  content: string
  /** 1-indexerat, som i vim. */
  start: { line: number; col: number }
  extensions?: import('@codemirror/state').Extension[]
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

export function createSession(options: SessionOptions): Session {
  const { content, start, extensions = [] } = options

  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())

  const view = new EditorView({
    state: EditorState.create({
      doc: content,
      extensions: [vim(), EditorView.updateListener.of(notify), ...extensions],
    }),
    parent: options.parent ?? document.createElement('div'),
  })
  const cm = getCM(view)!
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
    view.destroy()
  }

  return { view, sendKeys, getState, reset, subscribe, destroy }
}
