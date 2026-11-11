import { defineExercise } from '../../../define'

const expected = `// Goal: change the title to \`Update name\`.

<button title='Update name'>Go</button>`

export default defineExercise(
  {
    id: 'change-in-quotes',
    activeFile: 'src/Button.tsx',
    start: { line: 3, col: 16 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci\'Update name<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
