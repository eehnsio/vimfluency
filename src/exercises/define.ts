import type { Exercise } from './types'

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
