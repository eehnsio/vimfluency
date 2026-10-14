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

/**
 * Sant om det enda som saknas är att gå tillbaka till normalt läge: alla andra
 * checkar passerar och en `mode`-check faller. Då är texten redan rätt.
 */
export function onlyNeedsNormalMode(checks: Check[], state: EditorState, initialContent: string): boolean {
  const modeChecks = checks.filter((check) => check.type === 'mode')
  if (modeChecks.length === 0 || state.mode === 'normal') return false
  const others = checks.filter((check) => check.type !== 'mode')
  return evaluate(others, state, initialContent).passed
}

export function evaluate(checks: Check[], state: EditorState, initialContent: string): CheckResult {
  const failed = checks.filter((check) => !passes(check, state, initialContent))
  return { passed: failed.length === 0, failed }
}
