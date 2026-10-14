import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'intro-line-numbers',
    title: 'The numbers on the left',
    instructions:
      'The gutter shows line numbers. The line you are on shows its real number, and every other line shows how far away it is. That distance is what you type in front of `j` and `k`. Jump three lines down.',
    hints: [
      'Press `3` and then `j`.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 6, col: 1 },
    checks: [{ type: 'cursorAt', line: 9 }, { type: 'contentUnchanged' }],
    solution: '3j',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
