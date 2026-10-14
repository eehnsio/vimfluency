import type { Check, Mode } from '../exercises/types'

export interface EditorState {
  content: string
  /** 1-indexerat, som i vim. */
  cursor: { line: number; col: number }
  mode: Mode
  /** Alternativ som `:set` ändrar. */
  options: { number: boolean; relativenumber: boolean }
}

export interface CheckResult {
  passed: boolean
  failed: Check[]
}

function passes(check: Check, state: EditorState, initialContent: string): boolean {
  switch (check.type) {
    case 'cursorAt':
      return (
        state.cursor.line === check.line &&
        (check.col === undefined || state.cursor.col === check.col)
      )
    case 'contentEquals':
      return state.content === check.expected
    case 'contentUnchanged':
      return state.content === initialContent
    case 'mode':
      return state.mode === check.mode
    case 'option':
      return state.options[check.name] === check.value
  }
}

export function evaluate(checks: Check[], state: EditorState, initialContent: string): CheckResult {
  const failed = checks.filter((check) => !passes(check, state, initialContent))
  return { passed: failed.length === 0, failed }
}
