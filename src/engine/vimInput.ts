import type { EditorView } from '@codemirror/view'
import { Vim, getCM } from '@replit/codemirror-vim'
import type { Mode } from '../exercises/types'
import { keyFromEvent } from './lock'

/** Vim-pluginets editorobjekt för en vy. */
export type VimEditor = NonNullable<ReturnType<typeof getCM>>

export function vimMode(cm: VimEditor): Mode {
  const state = cm.state.vim
  if (state?.insertMode) return 'insert'
  if (state?.visualMode) return 'visual'
  return 'normal'
}

/** Inputfältet för en öppen prompt (`:`, `/`, `?`), annars `null`. */
export function openPrompt(view: EditorView): HTMLInputElement | null {
  return view.dom.querySelector('input')
}

function pressInPrompt(input: HTMLInputElement, key: 'Enter' | 'Escape') {
  const keyCode = key === 'Enter' ? 13 : 27
  input.dispatchEvent(new KeyboardEvent('keydown', { key, keyCode, bubbles: true, cancelable: true }))
}

/** Stänger en öppen prompt utan att köra den. */
export function closePrompt(view: EditorView) {
  const input = openPrompt(view)
  if (input) pressInPrompt(input, 'Escape')
}

function typeInPrompt(input: HTMLInputElement, key: string) {
  if (key === '<CR>') pressInPrompt(input, 'Enter')
  else if (key === '<Esc>') pressInPrompt(input, 'Escape')
  else if (key === '<BS>') input.value = input.value.slice(0, -1)
  else input.value += key
}

function insertText(view: EditorView, text: string) {
  view.dispatch(view.state.replaceSelection(text))
}

function backspace(view: EditorView) {
  const { from, empty } = view.state.selection.main
  if (!empty) return insertText(view, '')
  if (from > 0) view.dispatch({ changes: { from: from - 1, to: from }, selection: { anchor: from - 1 } })
}

/** Pluginet skriver inte själv in tecken i insert-läge via `handleKey`. */
function typeInInsertMode(view: EditorView, cm: VimEditor, key: string) {
  if (key === '<CR>') insertText(view, '\n')
  else if (key === '<BS>') backspace(view)
  else if (key === '<Tab>') insertText(view, '\t')
  else if (key.length === 1) insertText(view, key)
  else Vim.handleKey(cm, key, 'user')
}

/**
 * Skickar en tangent (notation som i `parseKeys`) dit den hör hemma: en öppen
 * prompt tar emot den i sitt inputfält, insert-läget skriver tecken själv och
 * allt annat går till pluginet.
 */
export function feedKey(view: EditorView, cm: VimEditor, key: string) {
  const input = openPrompt(view)
  if (input) return typeInPrompt(input, key)

  const isTextKey = key !== '<Esc>' && !/^<[CSAM]-/.test(key)
  if (vimMode(cm) === 'insert' && isTextKey) return typeInInsertMode(view, cm, key)

  Vim.handleKey(cm, key, 'user')
}

interface KeyLock {
  view: EditorView
  cm: VimEditor
  allowedKeys: ReadonlySet<string>
  /** Utan den finns ingen nödutgång och `r` följer vanliga regler. */
  onBlocked?: (key: string) => void
}

/**
 * Tangentlåset för en övning. Returnerar en `keydown`-lyssnare som stoppar allt
 * utom `allowedKeys`. Tab och Shift+Tab i normalläge flyttar fokus ut ur editorn.
 *
 * `r` är nödutgången och räknas som låst även när lösningen innehåller ett `r`
 * (t.ex. i texten man skriver). I insert-läge och i prompter är `r` däremot ett
 * vanligt tecken. Ingen lösning får använda `r` som normalläges-kommando, vilket
 * `exercises.test.ts` bevakar.
 */
export function createKeyLock({ view, cm, allowedKeys, onBlocked }: KeyLock) {
  return (event: KeyboardEvent) => {
    const key = keyFromEvent(event)
    if (key === null) return

    const typesText = vimMode(cm) === 'insert' || openPrompt(view) !== null
    const isEmergencyExit = key === 'r' && onBlocked !== undefined && !typesText
    if (!isEmergencyExit && allowedKeys.has(key)) return
    // Man ska alltid kunna sudda när man skrivit fel, i insert-läge och i prompter.
    if (key === '<BS>' && typesText) return
    // Tab flyttar fokus ut ur editorn, annars är den en tangentbordsfälla (WCAG
    // 2.1.2). Pluginet får inte se tangenten, men webbläsaren gör sitt.
    if (key === '<Tab>' && !typesText) {
      event.stopPropagation()
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onBlocked?.(key)
  }
}
