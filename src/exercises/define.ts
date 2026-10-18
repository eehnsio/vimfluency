import type { Exercise } from './types'

/** Innehållet i övningens aktiva fil, som den ser ut när övningen börjar. */
export function activeContent(exercise: Exercise): string {
  return exercise.files.find((file) => file.path === exercise.activeFile)!.content
}

export type ExerciseMeta = Omit<Exercise, 'files'>

/**
 * `rawFiles` kommer från `import.meta.glob('./files/**', { query: '?raw', ... })`
 * och har nycklar som `./files/src/Counter.tsx`. Sökvägarna görs relativa `files/`.
 */
export function defineExercise(meta: ExerciseMeta, rawFiles: Record<string, string>): Exercise {
  const files = Object.entries(rawFiles)
    .map(([key, content]) => ({ path: key.replace(/^\.\/files\//, ''), content }))
    .sort((a, b) => a.path.localeCompare(b.path))

  if (!files.some((file) => file.path === meta.activeFile)) {
    throw new Error(`Exercise "${meta.id}": activeFile "${meta.activeFile}" not found in files/`)
  }
  return { ...meta, files }
}

/**
 * Målet står på första raden i aktiv fil som `// Goal: …`. Lektionen visar
 * samma text, så målet skrivs bara på ett ställe.
 */
export function goalOf(exercise: Exercise): string | undefined {
  const firstLine = activeContent(exercise).split('\n')[0]
  return /^\/\/ Goal: (.+)$/.exec(firstLine)?.[1]
}
