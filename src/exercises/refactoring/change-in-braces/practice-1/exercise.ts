import { defineExercise } from '../../../define'

const expected = `// Goal: render \`title\` instead of the string.

<h1>{title}</h1>`

export default defineExercise(
  {
    id: 'change-in-braces-2',
    activeFile: 'src/Title.tsx',
    start: { line: 3, col: 7 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci{title<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
