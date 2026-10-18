import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'word-end',
    title: 'End of a word: e',
    instructions:
      '`e` jumps to the end of the current or next word.',
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
