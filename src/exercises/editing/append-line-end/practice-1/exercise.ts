import { defineExercise } from '../../../define'

const expected = `// Goal: add \` + tax\` at the end of the line.

const total = price + tax`

export default defineExercise(
  {
    id: 'append-line-end-2',
    activeFile: 'src/total.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'A + tax<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
