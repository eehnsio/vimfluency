import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-back-3',
    hints: ['`(`, `0` and `)` are three separate words.'],
    activeFile: 'src/Counter.ts',
    start: { line: 3, col: 37 },
    checks: [{ type: 'cursorAt', line: 3, col: 27 }, { type: 'contentUnchanged' }],
    solution: '3b',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
