import { defineExercise } from '../../../define'

const expected = `// Goal: empty the call so it reads \`call()\`.

call()`

export default defineExercise(
  {
    id: 'visual-inside-parens',
    activeFile: 'src/call.ts',
    start: { line: 3, col: 13 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'vi(d',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
