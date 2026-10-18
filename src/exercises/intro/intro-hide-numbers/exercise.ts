import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'intro-hide-numbers',
    title: 'Everything can be configured',
    instructions:
      'Vim is configured with commands that start with `:`. `:set nonumber` turns the line numbers off and `:set number` turns them back on. Enter runs the command.',
    hints: [
      'Type `:set nonumber` and press Enter.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 3, col: 1 },
    checks: [{ type: 'option', name: 'number', value: false }, { type: 'contentUnchanged' }],
    solution: ':set nonumber<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
