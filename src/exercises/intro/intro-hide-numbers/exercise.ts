import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'intro-hide-numbers',
    title: 'Everything can be configured',
    instructions:
      'Vim is configured with commands that start with `:`. Turn the line numbers off with `:set nonumber` and press Enter. You can turn them back on with `:set number`.',
    hints: [
      'Type `:set nonumber` and press Enter.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 5, col: 1 },
    checks: [{ type: 'option', name: 'number', value: false }, { type: 'contentUnchanged' }],
    solution: ':set nonumber<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
