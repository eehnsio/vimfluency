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
  lessons: Lesson[]
}

/**
 * En lektion lär ut en sak. Förklaringen står här, en gång. Första övningen är
 * den guidade ("Try it") med hintar, resten är praktik på samma tangenter.
 * Alla övningar i lektionen delar lås, så texten får nämna hela lektionens tangenter.
 */
export interface Lesson {
  id: string
  /** "Move down and up: j and k". Delen efter kolon visas som tangentchips i kurslistan. */
  title: string
  /** Förklarar tangenterna. Upprepar inte målen, som står i övningarnas filer (testas). */
  instructions: string
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
  /** Radnummer syns, vilken sort som helst (`number` eller `relativenumber`). */
  | { type: 'numbersShown' }
  /** Inga radnummer syns (varken `number` eller `relativenumber`). */
  | { type: 'numbersHidden' }

export interface Exercise {
  id: string
  /** Visas en i taget. Praktikövningar klarar sig ofta utan. */
  hints?: string[]
  files: VirtualFile[]
  activeFile: string
  start: { line: number; col: number }
  checks: Check[]
  /** Referenslösning i vim-notation. Kommandotangenterna i den är det övningen lär ut. */
  solution: string
  /**
   * Extra kommandotangenter (vim-notation) som lektionen lär ut utan att
   * lösningen använder dem, t.ex. `k` när texten förklarar både `j` och `k`.
   */
  allowedKeys?: string
  /**
   * Radnummer som övningen alltid startar med. Utan det startar den med
   * användarens val (`:set number`, `relativenumber` eller båda).
   */
  numbers?: NumberOptions
  /** Radnumren när övningen är klar sparas som användarens val (steget i introt). */
  savesNumberChoice?: boolean
}
