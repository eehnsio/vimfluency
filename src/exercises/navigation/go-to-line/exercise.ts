import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'go-to-line',
    title: 'Jump to a line number: :N',
    instructions:
      'Type `:` followed by a line number and press Enter to jump straight to that line. Use the relative numbers in the gutter to confirm where you are.',
    hints: [
      'The line number is in the comment at the top of the file.',
    ],
    activeFile: 'src/items.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'cursorAt', line: 16 }, { type: 'contentUnchanged' }],
    solution: ':16<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
