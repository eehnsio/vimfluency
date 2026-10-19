import { javascript } from '@codemirror/lang-javascript'
import { activeContent } from '../exercises/define'
import type { Exercise, NumberOptions } from '../exercises/types'
import { editorTheme } from './editorTheme'
import { goalLine } from './goalLine'
import { deriveAllowedKeys } from './lock'
import { createSession, type Session } from './session'

interface ExerciseSessionOptions {
  parent?: HTMLElement
  /** Anropas med tangenten när en låst tangent trycks. `r` är nödutgången. */
  onBlocked?: (key: string) => void
  /** Användarens val av radnummer. Övningens egna `numbers` går före. */
  numberOptions?: NumberOptions
}

/** Hybrid, som många har i sin nvim-config. Gäller tills användaren valt i introt. */
export const DEFAULT_NUMBERS: NumberOptions = { number: true, relativenumber: true }

/** Radnumren övningen startar med. */
export function startNumbers(exercise: Exercise, preference: NumberOptions = DEFAULT_NUMBERS): NumberOptions {
  return exercise.numbers ?? preference
}

/**
 * Sessionen precis som användaren möter den: låst till övningens tangenter, med
 * TSX-färgning, tema, markerad målrad och radnummer. UI:t och övningstesterna bygger båda på den,
 * så ett test bevisar samma beteende som i webbläsaren.
 */
export function createExerciseSession(exercise: Exercise, options: ExerciseSessionOptions = {}): Session {
  return createSession({
    parent: options.parent,
    content: activeContent(exercise),
    start: exercise.start,
    extensions: [javascript({ jsx: true, typescript: true }), editorTheme, goalLine],
    lineNumbers: true,
    numberOptions: startNumbers(exercise, options.numberOptions),
    allowedKeys: deriveAllowedKeys(exercise.solution, exercise.allowedKeys),
    onBlocked: options.onBlocked,
  })
}
