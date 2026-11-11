import { defineExercise } from '../../../define'

const expected = `// Goal: delete the two \`drop\` lines.

const keep = 1
const keepToo = 4`

export default defineExercise(
  {
    id: 'visual-lines-3',
    hints: ['`k` extends the selection upwards.'],
    activeFile: 'src/constants.ts',
    start: { line: 5, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'Vkd',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
