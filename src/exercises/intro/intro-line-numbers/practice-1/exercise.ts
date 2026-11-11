import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'intro-line-numbers-2',
    hints: ['Press `3` and then `k`.'],
    activeFile: 'src/App.tsx',
    start: { line: 7, col: 1 },
    checks: [{ type: 'cursorAt', line: 4 }, { type: 'contentUnchanged' }],
    solution: '3k',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
