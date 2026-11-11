import { Prec, type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Vim, getCM } from '@replit/codemirror-vim'
import type { Mode } from '../exercises/types'
import { COMPOSING_KEYS, isAltGr, keyFromEvent } from './lock'

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

/** Sant när tangenter skriver text istället för att vara kommandon: insert-läge eller en öppen prompt. */
const typesText = (view: EditorView, cm: VimEditor) => vimMode(cm) === 'insert' || openPrompt(view) !== null

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

function block(event: KeyboardEvent, key: string, onBlocked?: (key: string) => void) {
  event.preventDefault()
  event.stopPropagation()
  onBlocked?.(key)
}

/**
 * Tangentlåset för en övning. Returnerar en `keydown`-lyssnare som i normal-
 * och visualläge stoppar allt utom `allowedKeys`. I insert-läge och i prompter
 * är texten fri: låset gäller kommandon, inte vad man skriver.
 *
 * `r` är nödutgången och räknas som låst i normalläge även när den lärts ut
 * (t.ex. som tecken i texten man skriver). Ingen lösning får använda `r` som
 * normalläges-kommando, vilket `exercises.test.ts` bevakar.
 *
 * Tab och Shift+Tab i normalläge flyttar fokus ut ur editorn (WCAG 2.1.2).
 */
export function createKeyLock({ view, cm, allowedKeys, onBlocked }: KeyLock) {
  return (event: KeyboardEvent) => {
    const key = keyFromEvent(event)
    if (key === null) return
    // Döda tangenter och IME: tecknet kommer via composition och prövas i
    // `createTextLock`. I insert-läge skrivs det som vanligt.
    if (COMPOSING_KEYS.has(key)) return

    if (typesText(view, cm)) {
      // Tecken, Enter, Backspace och Esc är alltid fria. Tab och Ctrl-kombinationer
      // följer låset, så ingen tangent fastnar i editorn av misstag.
      if (key.length === 1 || key === '<CR>' || key === '<BS>' || key === '<Esc>' || allowedKeys.has(key)) return
      return block(event, key, onBlocked)
    }

    const isEmergencyExit = key === 'r' && onBlocked !== undefined
    if (!isEmergencyExit && allowedKeys.has(key)) {
      // AltGr (Windows): pluginet läser det som Ctrl+Alt, så tangenten matas in här.
      if (isAltGr(event)) {
        event.preventDefault()
        event.stopPropagation()
        Vim.handleKey(cm, key, 'user')
      }
      return
    }
    // Tab flyttar fokus ut ur editorn, annars är den en tangentbordsfälla.
    // Pluginet får inte se tangenten, men webbläsaren gör sitt.
    if (key === '<Tab>') {
      event.stopPropagation()
      return
    }
    block(event, key, onBlocked)
  }
}

/**
 * Låset för tecken som kommer via composition istället för `keydown`: döda
 * tangenter (`^` på svensk layout) och IME. I normal- och visualläge gör
 * pluginet dem till kommandon, så de prövas mot samma lista. I insert-läge och
 * prompter är de fri text. Ligger före pluginets egen `inputHandler`.
 */
export function createTextLock(allowedKeys: ReadonlySet<string>, onBlocked?: (key: string) => void): Extension {
  return Prec.highest(
    EditorView.inputHandler.of((view, _from, _to, text) => {
      const cm = getCM(view)
      if (!cm || typesText(view, cm)) return false
      if (text.length === 1 && allowedKeys.has(text)) return false
      onBlocked?.(text)
      // Hanterad utan ändring: CodeMirror ritar om raden så att tecknet försvinner ur DOM:en.
      return true
    }),
  )
}
