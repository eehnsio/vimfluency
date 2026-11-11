import { defineExercise } from '../../../define'

const expected = `// Goal: replace everything inside the parentheses with \`props\`.

function Greeting(props) {
  return <p>{name}</p>
}`

export default defineExercise(
  {
    id: 'change-in-parens',
    hints: [
      'After `ci(` you are in insert mode. Type `props` and press `Esc`.',
    ],
    activeFile: 'src/Greeting.tsx',
    start: { line: 3, col: 21 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci(props<Esc>',
    // Lektionen nämner `cib`, samma kommando.
    allowedKeys: 'cib',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
