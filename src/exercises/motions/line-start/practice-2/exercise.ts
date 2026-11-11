import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'line-start-3',
    activeFile: 'src/App.tsx',
    start: { line: 4, col: 20 },
    checks: [{ type: 'cursorAt', line: 5, col: 3 }, { type: 'contentUnchanged' }],
    solution: 'j^',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
