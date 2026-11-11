import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'move-up-down-2',
    hints: ['Count the lines up to TARGET and put that number in front of `k`.'],
    activeFile: 'src/App.tsx',
    start: { line: 9, col: 1 },
    checks: [{ type: 'cursorAt', line: 4 }, { type: 'contentUnchanged' }],
    solution: '5k',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
