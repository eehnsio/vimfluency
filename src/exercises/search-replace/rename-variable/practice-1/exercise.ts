import { defineExercise } from '../../../define'

const expected = `// Goal: give the parameter the name \`entry\` everywhere it is used.

export function render(entry) {
  const label = entry.name
  return <li key={entry.id}>{label}</li>
}`

export default defineExercise(
  {
    id: 'rename-variable-2',
    activeFile: 'src/List.tsx',
    start: { line: 1, col: 1 },
    checks: [{ type: 'contentEquals', expected }],
    solution: ':%s/item/entry/g<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
