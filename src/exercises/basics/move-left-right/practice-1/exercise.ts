import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'move-left-right-2',
    activeFile: 'src/greeting.ts',
    start: { line: 3, col: 24 },
    checks: [{ type: 'cursorAt', line: 3, col: 16 }, { type: 'contentUnchanged' }],
    solution: '8h',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
