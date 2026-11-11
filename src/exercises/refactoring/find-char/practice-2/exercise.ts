import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'find-char-3',
    activeFile: 'src/total.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 18 }, { type: 'contentUnchanged' }],
    solution: 'f(',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
