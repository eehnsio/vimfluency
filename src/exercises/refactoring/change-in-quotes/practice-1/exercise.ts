import { defineExercise } from '../../../define'

const expected = `// Goal: change the label to \`Delete\`.

<button aria-label="Delete">Go</button>`

export default defineExercise(
  {
    id: 'change-in-quotes-2',
    activeFile: 'src/Button.tsx',
    start: { line: 3, col: 21 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci"Delete<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
