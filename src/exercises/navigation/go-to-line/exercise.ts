import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'go-to-line',
    title: 'Jump to a line number: :N',
    instructions:
      'Type `:` followed by a line number and press Enter to jump straight to that line. `:` always counts from the top of the file, whichever line numbers you show. Relative numbers on the left are distances for `j` and `k`, not line numbers. The real line number is always in the bottom right, as line:column.',
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
