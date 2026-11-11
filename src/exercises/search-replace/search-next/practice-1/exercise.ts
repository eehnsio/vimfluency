import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'search-next-2',
    activeFile: 'src/api.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 8, col: 3 }, { type: 'contentUnchanged' }],
    solution: '/return<CR>n',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
