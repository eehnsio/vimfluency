import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'word-jumps',
    title: 'Jump between words',
    instructions:
      '`w` jumps to the start of the next word. A count in front of a motion repeats it, so `3w` jumps three words forward.',
    hints: [
      'Punctuation such as `[` and `,` counts as a word for `w`.',
      'Count the words between `const` and `setCount`, then prefix `w` with that number.',
    ],
    activeFile: 'src/Counter.tsx',
    start: { line: 6, col: 3 },
    checks: [{ type: 'cursorAt', line: 6, col: 17 }, { type: 'contentUnchanged' }],
    solution: '4w',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
