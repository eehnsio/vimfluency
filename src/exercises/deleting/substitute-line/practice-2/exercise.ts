import { defineExercise } from '../../../define'

const expected = `// Goal: replace the second \`const\` line with \`const b = 20\`.

const a = 1
const b = 20`

export default defineExercise(
  {
    id: 'substitute-line-3',
    activeFile: 'src/pair.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'jSconst b = 20<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
