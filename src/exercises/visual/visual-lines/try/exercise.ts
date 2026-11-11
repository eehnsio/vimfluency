import { defineExercise } from '../../../define'

const expected = `// Goal: delete the two \`drop\` lines.

const keep = 1
const keepToo = 4`

export default defineExercise(
  {
    id: 'visual-lines',
    activeFile: 'src/constants.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'Vjd',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
