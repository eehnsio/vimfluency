import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'word-jumps',
    title: 'Jump between words',
    instructions:
      'The cursor starts on `const`. Move it to the start of `setCount` on the same line without using the arrow keys. A count in front of a motion repeats it, so `3w` jumps three words forward.',
    hints: [
      'Punctuation such as `[` and `,` counts as a word for `w`.',
      'Count the words between `const` and `setCount`, then prefix `w` with that number.',
    ],
    activeFile: 'src/Counter.tsx',
    start: { line: 8, col: 3 },
    checks: [{ type: 'cursorAt', line: 8, col: 17 }, { type: 'contentUnchanged' }],
    solution: '4w',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
