import { defineExercise } from '../../../define'

const expected = `// Goal: remove the argument so the call is \`log()\`.

log()`

export default defineExercise(
  {
    id: 'delete-to-char-3',
    activeFile: 'src/log.ts',
    start: { line: 3, col: 5 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dt)',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
