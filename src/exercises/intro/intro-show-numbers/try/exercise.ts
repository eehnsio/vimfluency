import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'intro-show-numbers',
    hints: ['Type `:set number` or `:set relativenumber`, then press Enter.'],
    activeFile: 'src/App.tsx',
    start: { line: 3, col: 1 },
    numbers: { number: false, relativenumber: false },
    savesNumberChoice: true,
    checks: [{ type: 'numbersShown' }, { type: 'contentUnchanged' }],
    solution: ':set number<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
