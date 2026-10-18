import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'search-next',
    title: 'Search: / and n',
    instructions:
      '`/` searches forward, `Enter` confirms, `n` jumps to the next match and `N` to the previous.',
    hints: [
      '`/NOTE` then Enter finds the first one. Press `n` twice more.',
    ],
    activeFile: 'src/api.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 14, col: 6 }, { type: 'contentUnchanged' }],
    solution: '/NOTE<CR>nn',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
