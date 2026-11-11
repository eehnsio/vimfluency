import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'search-next-3',
    hints: ['`N` goes backwards, and wraps around to the end of the file.'],
    activeFile: 'src/api.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 14, col: 6 }, { type: 'contentUnchanged' }],
    solution: '/NOTE<CR>N',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
