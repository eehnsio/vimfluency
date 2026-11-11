import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'move-around-2',
    hints: ['Up first, then right.'],
    activeFile: 'src/Label.tsx',
    start: { line: 6, col: 1 },
    checks: [{ type: 'cursorAt', line: 4, col: 18 }, { type: 'contentUnchanged' }],
    solution: '2k17l',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
