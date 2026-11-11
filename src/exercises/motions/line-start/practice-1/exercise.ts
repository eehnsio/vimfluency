import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'line-start-2',
    hints: ['`^` skips the indentation, `0` does not.'],
    activeFile: 'src/App.tsx',
    start: { line: 4, col: 13 },
    checks: [{ type: 'cursorAt', line: 4, col: 1 }, { type: 'contentUnchanged' }],
    solution: '0',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
