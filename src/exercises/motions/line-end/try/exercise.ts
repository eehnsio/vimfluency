import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'line-end',
    activeFile: 'src/App.tsx',
    start: { line: 4, col: 3 },
    checks: [{ type: 'cursorAt', line: 4, col: 21 }, { type: 'contentUnchanged' }],
    solution: '$',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
