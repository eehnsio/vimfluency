import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'intro-hide-numbers',
    hints: [
      'Turn off each kind you have on. With both absolute and relative numbers, that is two commands.',
      'Type `:set nonumber` and press Enter. If numbers still show, also type `:set norelativenumber`.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 3, col: 1 },
    checks: [{ type: 'numbersHidden' }, { type: 'contentUnchanged' }],
    // Fungerar med alla val: att stänga av något som redan är av gör ingenting.
    solution: ':set nonumber<CR>:set norelativenumber<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
