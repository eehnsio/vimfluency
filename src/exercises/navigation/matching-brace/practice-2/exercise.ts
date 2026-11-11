import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'matching-brace-3',
    activeFile: 'src/Greeting.tsx',
    start: { line: 8, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 54 }, { type: 'contentUnchanged' }],
    solution: '%',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
