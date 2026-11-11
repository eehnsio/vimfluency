import { defineExercise } from '../../../define'

const expected = `// Goal: replace the \`return\` line with \`return null\`, keeping the indentation.

function Empty() {
  return null
}`

export default defineExercise(
  {
    id: 'substitute-line-2',
    hints: ['`S` keeps the indentation of the line.'],
    activeFile: 'src/Empty.tsx',
    start: { line: 4, col: 3 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'Sreturn null<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
