import type { Check, Mode } from '../exercises/types'

export interface EditorState {
  content: string
  /** 1-indexerat, som i vim. */
  cursor: { line: number; col: number }
  mode: Mode
  keystrokes: number
}

export interface CheckResult {
  passed: boolean
  failed: Check[]
}

function passes(check: Check, state: EditorState): boolean {
  switch (check.type) {
    case 'cursorAt':
      return state.cursor.line === check.line && state.cursor.col === check.col
    case 'contentEquals':
      return state.content === check.expected
    case 'mode':
      return state.mode === check.mode
  }
}

export function evaluate(checks: Check[], state: EditorState): CheckResult {
  const failed = checks.filter((check) => !passes(check, state))
  return { passed: failed.length === 0, failed }
}
