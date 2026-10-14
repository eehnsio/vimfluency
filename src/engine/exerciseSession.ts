import { javascript } from '@codemirror/lang-javascript'
import { activeContent } from '../exercises/define'
import type { Exercise } from '../exercises/types'
import { editorTheme } from './editorTheme'
import { deriveAllowedKeys } from './lock'
import { createSession, type Session } from './session'

interface ExerciseSessionOptions {
  parent?: HTMLElement
  /** Anropas med tangenten när en låst tangent trycks. `r` är nödutgången. */
  onBlocked?: (key: string) => void
}

/**
 * Sessionen precis som användaren möter den: låst till övningens tangenter, med
 * TSX-färgning, tema och radnummer. UI:t och övningstesterna bygger båda på den,
 * så ett test bevisar samma beteende som i webbläsaren.
 */
export function createExerciseSession(exercise: Exercise, options: ExerciseSessionOptions = {}): Session {
  return createSession({
    parent: options.parent,
    content: activeContent(exercise),
    start: exercise.start,
    extensions: [javascript({ jsx: true, typescript: true }), editorTheme],
    lineNumbers: true,
    allowedKeys: deriveAllowedKeys(exercise.solution, exercise.allowedKeys),
    onBlocked: options.onBlocked,
  })
}
