export type Mode = 'normal' | 'insert' | 'visual'

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
  | { type: 'cursorAt'; line: number; col: number }
  | { type: 'contentEquals'; file?: string; expected: string }
  /** Innehållet i aktiv fil är orört, så en rörelse-övning inte klaras genom att radera. */
  | { type: 'contentUnchanged' }
  | { type: 'mode'; mode: Mode }

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
}
