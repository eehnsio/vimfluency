import { defineExercise } from '../../define'

const expected = `// Goal: remove the extra arguments so the call is \`setName('Lee')\`.
// \`dt)\` deletes from the cursor up to, but not including, the next \`)\`.

setName('Lee')`

export default defineExercise(
  {
    id: 'delete-to-char',
    title: 'Delete up to a character: dt',
    instructions:
      '`dt` followed by a character deletes up to, but not including, that character. Remove the extra arguments from the call.',
    hints: [
      'The cursor is on the first comma. `dt)` deletes up to the closing parenthesis.',
    ],
    activeFile: 'src/call.ts',
    start: { line: 4, col: 14 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dt)',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
