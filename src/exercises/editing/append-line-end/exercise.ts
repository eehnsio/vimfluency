import { defineExercise } from '../../define'

const expected = `// Goal: add a semicolon at the end of the line.
// \`A\` appends at the end of the line. \`I\` inserts at the start.

const total = 1;`

export default defineExercise(
  {
    id: 'append-line-end',
    title: 'Append at the end of the line: A',
    instructions:
      '`A` jumps to the end of the line and enters insert mode in one go. Add a semicolon to the end of the line.',
    hints: [
      'Press `A`, type `;` and press `Esc`.',
    ],
    activeFile: 'src/total.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'A;<Esc>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
