import { defineExercise } from '../../../define'

const expected = `// Goal: rename \`isOpen\` to \`isVisible\` on the \`showModal\` line only.

const isOpen = true
const showMenu = isOpen
const showModal = isVisible`

export default defineExercise(
  {
    id: 'replace-current-line-3',
    hints: ['Move to the line first.'],
    activeFile: 'src/menu.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'j:s/isOpen/isVisible/<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
