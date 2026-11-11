import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'go-to-line-2',
    activeFile: 'src/items.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 8 }, { type: 'contentUnchanged' }],
    solution: ':8<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
