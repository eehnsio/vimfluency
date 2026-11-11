import { defineExercise } from '../../../define'

const expected = `// Goal: empty the string so the line reads \`const name = ''\`.

const name = ''`

export default defineExercise(
  {
    id: 'visual-inside-parens-3',
    activeFile: 'src/name.ts',
    start: { line: 3, col: 15 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'vi\'d',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
