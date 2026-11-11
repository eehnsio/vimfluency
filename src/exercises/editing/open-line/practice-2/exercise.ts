import { defineExercise } from '../../../define'

const expected = `// Goal: add \`console.log(name)\` below the \`const\` line.

function greet(name) {
  const upper = name.toUpperCase()
  console.log(name)
  return upper
}`

export default defineExercise(
  {
    id: 'open-line-3',
    hints: ['The new line gets the same indentation as the one above it.'],
    activeFile: 'src/greet.ts',
    start: { line: 4, col: 3 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'oconsole.log(name)<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
