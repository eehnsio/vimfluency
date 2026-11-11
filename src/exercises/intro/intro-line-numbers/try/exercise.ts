import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'intro-line-numbers',
    hints: ['The count goes before the motion.', 'Press `3` and then `j`.'],
    activeFile: 'src/App.tsx',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 6 }, { type: 'contentUnchanged' }],
    solution: '3j',
    allowedKeys: 'k',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
