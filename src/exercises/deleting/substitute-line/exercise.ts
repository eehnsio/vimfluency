import { defineExercise } from '../../define'

const expected = `// Goal: replace the line below with \`<section>New</section>\`.

<section>New</section>`

export default defineExercise(
  {
    id: 'substitute-line',
    title: 'Replace a whole line: S',
    instructions:
      '`S` deletes the whole line and enters insert mode, which is quicker than `dd` followed by `O`.',
    activeFile: 'src/Section.tsx',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'S<section>New</section><Esc>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
