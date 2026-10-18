import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'move-up-down',
    title: 'Move down and up: j and k',
    instructions:
      'Vim keeps your fingers on the home row. `j` moves down and `k` moves up.',
    hints: ['Count the lines between the cursor and TARGET and put that number in front of `j`.'],
    activeFile: 'src/App.tsx',
    start: { line: 1, col: 1 },
    checks: [{ type: 'cursorAt', line: 7 }, { type: 'contentUnchanged' }],
    solution: '6j',
    allowedKeys: 'k',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
