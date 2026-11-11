import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'line-start',
    hints: [
      '`0` goes to column 1, which is on the indentation here. Use `^`.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 4, col: 13 },
    checks: [{ type: 'cursorAt', line: 4, col: 3 }, { type: 'contentUnchanged' }],
    solution: '^',
    allowedKeys: '0',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
