import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'line-end-2',
    activeFile: 'src/App.tsx',
    start: { line: 4, col: 3 },
    checks: [{ type: 'cursorAt', line: 5, col: 26 }, { type: 'contentUnchanged' }],
    solution: 'j$',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
