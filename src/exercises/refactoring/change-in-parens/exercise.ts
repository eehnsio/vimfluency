import { defineExercise } from '../../define'

const expected = `// Goal: replace everything inside the parentheses with \`props\`.
// \`ci(\` changes inside parentheses. \`ci{\` and \`ci'\` work the same way.

function Greeting(props) {
  return <p>{name}</p>
}`

export default defineExercise(
  {
    id: 'change-in-parens',
    title: 'Change inside parentheses: ci(',
    instructions:
      '`ci(` changes everything between the nearest parentheses, wherever the cursor is inside them. Replace the destructured props with `props`.',
    hints: [
      'After `ci(` you are in insert mode. Type `props` and press `Esc`.',
    ],
    activeFile: 'src/Greeting.tsx',
    start: { line: 4, col: 21 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci(props<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
