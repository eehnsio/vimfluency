import { defineExercise } from '../../define'

const expected = `// Goal: rename \`isOpen\` to \`isVisible\` on the cursor line only.
// \`:s/old/new/\` works on the current line. \`:%s/old/new/g\` works on every line.

const isOpen = true
const showMenu = isVisible
const showModal = isOpen`

export default defineExercise(
  {
    id: 'replace-current-line',
    title: 'Replace on one line: :s',
    instructions:
      '`:s/old/new/` replaces on the current line only, while `:%s` covers the whole file. Rename `isOpen` to `isVisible` only on the cursor line.',
    activeFile: 'src/menu.ts',
    start: { line: 5, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: ':s/isOpen/isVisible/<CR>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
