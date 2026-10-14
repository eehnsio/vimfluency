import { defineExercise } from '../../define'

const expected = `// Goal: delete the two \`drop\` lines.
// \`V\` selects the whole line. \`j\` extends it down. \`d\` deletes the selection.

const keep = 1
const keepToo = 4`

export default defineExercise(
  {
    id: 'visual-lines',
    title: 'Select lines: V',
    instructions:
      '`V` selects whole lines. Extend the selection with `j` and delete it with `d`. Remove the two `drop` lines.',
    activeFile: 'src/constants.ts',
    start: { line: 5, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'Vjd',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
