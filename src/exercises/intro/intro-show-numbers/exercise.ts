import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'intro-show-numbers',
    title: 'Show line numbers',
    instructions:
      'The highlighted first line in the editor is always your goal. Vim starts without line numbers. `:set number` shows the number of every line. `:set relativenumber` shows how far away each line is instead, which is the count you type in front of `j` and `k`. Commands that start with `:` run when you press Enter. Your choice is used in every exercise, and you can switch it at the top of this column.',
    hints: ['Type `:set number` or `:set relativenumber`, then press Enter.'],
    activeFile: 'src/App.tsx',
    start: { line: 3, col: 1 },
    numbers: { number: false, relativenumber: false },
    savesNumberChoice: true,
    checks: [{ type: 'numbersShown' }, { type: 'contentUnchanged' }],
    solution: ':set number<CR>',
    // Båda valen ska gå att skriva.
    allowedKeys: ':set relativenumber<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
