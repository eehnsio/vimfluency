import { defineExercise } from '../../../define'

const expected = `// Goal: give the style object a single property, \`color: 'red'\`.

const style = { color: 'red' }`

export default defineExercise(
  {
    id: 'change-in-braces-3',
    hints: ['Type the spaces inside the braces yourself: `ci{` removes them too.'],
    activeFile: 'src/style.ts',
    start: { line: 3, col: 17 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci{ color: \'red\' <Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
