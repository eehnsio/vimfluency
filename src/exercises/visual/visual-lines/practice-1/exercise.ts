import { defineExercise } from '../../../define'

const expected = `// Goal: delete the three \`drop\` lines.

const keep = 1
const keepToo = 5`

export default defineExercise(
  {
    id: 'visual-lines-2',
    hints: ['A count works in visual mode too: `2j` extends the selection by two lines.'],
    activeFile: 'src/constants.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'V2jd',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
