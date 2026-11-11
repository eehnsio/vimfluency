import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'line-end-3',
    activeFile: 'src/hooks.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 52 }, { type: 'contentUnchanged' }],
    solution: '$',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
