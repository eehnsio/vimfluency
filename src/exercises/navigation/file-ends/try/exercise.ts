import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'file-bottom',
    activeFile: 'src/hooks.ts',
    start: { line: 6, col: 1 },
    checks: [{ type: 'cursorAt', line: 12 }, { type: 'contentUnchanged' }],
    solution: 'G',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
