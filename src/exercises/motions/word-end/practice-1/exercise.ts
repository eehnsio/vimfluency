import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-end-2',
    activeFile: 'src/Order.ts',
    start: { line: 3, col: 25 },
    checks: [{ type: 'cursorAt', line: 3, col: 36 }, { type: 'contentUnchanged' }],
    solution: '2e',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
