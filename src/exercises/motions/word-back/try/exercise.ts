import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-back',
    hints: [
      'Punctuation such as `+` and `=` counts as a word, so count those too.',
    ],
    activeFile: 'src/Order.ts',
    start: { line: 3, col: 29 },
    checks: [{ type: 'cursorAt', line: 3, col: 15 }, { type: 'contentUnchanged' }],
    solution: '4b',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
