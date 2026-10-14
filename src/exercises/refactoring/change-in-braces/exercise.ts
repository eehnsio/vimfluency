import { defineExercise } from '../../define'

const expected = `// Goal: replace the inline handler with \`handleClick\`.
// \`ci{\` changes inside curly braces.

<button onClick={handleClick}>Go</button>`

export default defineExercise(
  {
    id: 'change-in-braces',
    title: 'Change inside braces: ci{',
    instructions:
      '`ci{` changes everything between the nearest curly braces. Replace the inline handler with `handleClick`.',
    activeFile: 'src/Button.tsx',
    start: { line: 4, col: 18 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci{handleClick<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
