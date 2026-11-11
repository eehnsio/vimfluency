import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'word-jumps-2',
    hints: ['Each `{`, `}` and `\'` counts as a word of its own.'],
    activeFile: 'src/hooks.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 27 }, { type: 'contentUnchanged' }],
    solution: '6w',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
