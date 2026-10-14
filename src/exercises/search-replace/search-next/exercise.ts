import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'search-next',
    title: 'Search: / and n',
    instructions:
      '`/` searches forward, `Enter` confirms, `n` jumps to the next match and `N` to the previous. Land on the third NOTE.',
    hints: [
      '`/NOTE` then Enter finds the first one. Press `n` twice more.',
    ],
    activeFile: 'src/api.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'cursorAt', line: 15, col: 6 }, { type: 'contentUnchanged' }],
    solution: '/NOTE<CR>nn',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
