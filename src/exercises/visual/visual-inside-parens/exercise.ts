import { defineExercise } from '../../define'

const expected = `// Goal: empty the call so it reads \`call()\`.
// \`vi(\` selects inside the parentheses. Then \`d\` deletes the selection.

call()`

export default defineExercise(
  {
    id: 'visual-inside-parens',
    title: 'Select inside parentheses: vi(',
    instructions:
      '`v` starts visual mode, `i(` extends the selection to the contents of the parentheses and `d` deletes it. Empty the call.',
    activeFile: 'src/call.ts',
    start: { line: 4, col: 13 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'vi(d',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
