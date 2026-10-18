import { defineExercise } from '../../define'

const expected = `// Goal: delete the two \`drop\` lines.

const keep = 1
const keepToo = 4`

export default defineExercise(
  {
    id: 'visual-lines',
    title: 'Select lines: V',
    instructions:
      '`V` selects whole lines. `j` extends the selection and `d` deletes it.',
    activeFile: 'src/constants.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'Vjd',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
