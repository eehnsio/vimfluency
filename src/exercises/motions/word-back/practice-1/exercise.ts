import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-back-2',
    activeFile: 'src/Order.ts',
    start: { line: 3, col: 29 },
    checks: [{ type: 'cursorAt', line: 3, col: 23 }, { type: 'contentUnchanged' }],
    solution: '2b',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
