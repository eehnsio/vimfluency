import { defineExercise } from '../../../define'

const expected = `// Goal: add a semicolon at the end of the second \`const\` line.

const a = 1
const b = 2;`

export default defineExercise(
  {
    id: 'append-line-end-3',
    activeFile: 'src/pair.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'jA;<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
