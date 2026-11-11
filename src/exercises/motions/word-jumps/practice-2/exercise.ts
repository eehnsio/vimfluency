import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-jumps-3',
    hints: ['`j` first, then count the words.'],
    activeFile: 'src/Counter.tsx',
    start: { line: 4, col: 3 },
    checks: [{ type: 'cursorAt', line: 5, col: 19 }, { type: 'contentUnchanged' }],
    solution: 'j4w',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
