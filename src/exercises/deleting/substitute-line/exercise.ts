import { defineExercise } from '../../define'

const expected = `// Goal: replace the line below with \`<section>New</section>\`.
// \`S\` deletes the line and starts insert mode.

<section>New</section>`

export default defineExercise(
  {
    id: 'substitute-line',
    title: 'Replace a whole line: S',
    instructions:
      '`S` deletes the whole line and enters insert mode, which is quicker than `dd` followed by `O`. Replace the line with `<section>New</section>`.',
    activeFile: 'src/Section.tsx',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'S<section>New</section><Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
