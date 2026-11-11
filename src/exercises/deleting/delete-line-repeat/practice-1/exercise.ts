import { defineExercise } from '../../../define'

const expected = `// Goal: delete the \`console.log\` line.

function save(data) {
  return post(data)
}`

export default defineExercise(
  {
    id: 'delete-line-repeat-2',
    activeFile: 'src/save.ts',
    start: { line: 4, col: 3 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dd',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
