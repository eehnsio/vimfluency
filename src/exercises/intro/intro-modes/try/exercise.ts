import { defineExercise } from '../../../define'

const expected = `// Goal: type the word hello on the empty line below, then go back to NORMAL mode.

hello`

export default defineExercise(
  {
    id: 'intro-modes',
    hints: [
      '`i`, then `hello`, then `Esc`.',
    ],
    activeFile: 'src/hello.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ihello<Esc>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
