export type Mode = 'normal' | 'insert' | 'visual'

/** Vim-alternativen som `:set` styr radnumren med. */
export interface NumberOptions {
  number: boolean
  relativenumber: boolean
}

export interface Category {
  id: string
  title: string
  description: string
  /** Ordningen här är ordningen i UI:t. */
  exercises: Exercise[]
}

export interface VirtualFile {
  path: string
  content: string
}

export type Check =
  /** 1-indexerat, som i vim. */
  | { type: 'cursorAt'; line: number; col?: number }
  | { type: 'contentEquals'; expected: string }
  /** Innehållet i aktiv fil är orört, så en rörelse-övning inte klaras genom att radera. */
  | { type: 'contentUnchanged' }
  | { type: 'mode'; mode: Mode }
  /** Ett vim-alternativ (`:set number`) har ett visst värde. */
  | { type: 'option'; name: keyof NumberOptions; value: boolean }

export interface Exercise {
  id: string
  title: string
  instructions: string
  hints?: string[]
  files: VirtualFile[]
  activeFile: string
  start: { line: number; col: number }
  checks: Check[]
  /** Referenslösning i vim-notation. */
  solution: string
  /** Extra tangenter (vim-notation) utöver lösningens, t.ex. `u`. Allt annat är låst. */
  allowedKeys?: string
}
