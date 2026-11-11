import { defineExercise } from '../../../define'

const expected = `// Goal: rename \`count\` to \`total\` on the cursor line only.

const count = 0
const double = total * 2
const label = 'count'`

export default defineExercise(
  {
    id: 'replace-current-line-2',
    activeFile: 'src/count.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: ':s/count/total/<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
