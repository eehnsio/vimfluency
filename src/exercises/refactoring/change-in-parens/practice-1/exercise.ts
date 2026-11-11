import { defineExercise } from '../../../define'

const expected = `// Goal: make the call \`setItems([])\`, emptying the argument.

setItems([])`

export default defineExercise(
  {
    id: 'change-in-parens-2',
    hints: ['The cursor is inside the outer parentheses only, so that is the pair `ci(` picks.'],
    activeFile: 'src/items.ts',
    start: { line: 3, col: 10 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci([]<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
