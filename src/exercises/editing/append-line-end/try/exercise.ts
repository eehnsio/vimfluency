import { defineExercise } from '../../../define'

const expected = `// Goal: add a semicolon at the end of the line.

const total = 1;`

export default defineExercise(
  {
    id: 'append-line-end',
    hints: [
      'Press `A`, type `;` and press `Esc`.',
    ],
    activeFile: 'src/total.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'A;<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
