import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'go-to-line',
    hints: [
      'The line number is in the comment at the top of the file.',
      'With relative numbers, the number next to `answer` is a distance, not a line number. `:12` goes to line 12 from the top, while `12j` moves 12 lines down.',
    ],
    activeFile: 'src/items.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 15 }, { type: 'contentUnchanged' }],
    solution: ':15<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
