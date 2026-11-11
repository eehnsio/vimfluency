import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-end',
    hints: [
      '`total`, `=` and `price` are three words, so `3e` lands on the end of the third.',
    ],
    activeFile: 'src/Order.ts',
    start: { line: 3, col: 7 },
    checks: [{ type: 'cursorAt', line: 3, col: 19 }, { type: 'contentUnchanged' }],
    solution: '3e',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
