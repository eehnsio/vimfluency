import { defineExercise } from '../../../define'

const expected = `// Goal: remove the extra arguments so the call is \`setName('Lee')\`.

setName('Lee')`

export default defineExercise(
  {
    id: 'delete-to-char',
    hints: [
      'The cursor is on the first comma. `dt)` deletes up to the closing parenthesis.',
    ],
    activeFile: 'src/call.ts',
    start: { line: 3, col: 14 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dt)',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
