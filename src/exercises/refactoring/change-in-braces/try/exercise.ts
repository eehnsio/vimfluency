import { defineExercise } from '../../../define'

const expected = `// Goal: replace the inline handler with \`handleClick\`.

<button onClick={handleClick}>Go</button>`

export default defineExercise(
  {
    id: 'change-in-braces',
    activeFile: 'src/Button.tsx',
    start: { line: 3, col: 18 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci{handleClick<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
