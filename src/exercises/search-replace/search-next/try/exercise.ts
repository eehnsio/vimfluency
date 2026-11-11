import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'search-next',
    hints: [
      '`/NOTE` then Enter finds the first one. Press `n` twice more.',
    ],
    activeFile: 'src/api.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 14, col: 6 }, { type: 'contentUnchanged' }],
    solution: '/NOTE<CR>nn',
    allowedKeys: 'N',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
