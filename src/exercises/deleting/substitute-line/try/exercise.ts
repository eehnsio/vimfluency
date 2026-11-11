import { defineExercise } from '../../../define'

const expected = `// Goal: replace the line below with \`<section>New</section>\`.

<section>New</section>`

export default defineExercise(
  {
    id: 'substitute-line',
    activeFile: 'src/Section.tsx',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'S<section>New</section><Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
