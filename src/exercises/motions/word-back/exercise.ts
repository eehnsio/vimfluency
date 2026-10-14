import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'word-back',
    title: 'Back one word: b',
    instructions:
      'The cursor starts on `shipping`. `b` jumps back to the start of the previous word. Get to the start of `price`.',
    hints: [
      'Punctuation such as `+` and `=` counts as a word, so count those too.',
    ],
    activeFile: 'src/Order.ts',
    start: { line: 5, col: 29 },
    checks: [{ type: 'cursorAt', line: 5, col: 15 }, { type: 'contentUnchanged' }],
    solution: '4b',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
