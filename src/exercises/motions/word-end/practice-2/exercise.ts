import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-end-3',
    activeFile: 'src/Counter.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 22 }, { type: 'contentUnchanged' }],
    solution: '5e',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
