import { defineExercise } from '../../../define'

const expected = `// Goal: rename \`isOpen\` to \`isVisible\` on the cursor line only.

const isOpen = true
const showMenu = isVisible
const showModal = isOpen`

export default defineExercise(
  {
    id: 'replace-current-line',
    activeFile: 'src/menu.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: ':s/isOpen/isVisible/<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
