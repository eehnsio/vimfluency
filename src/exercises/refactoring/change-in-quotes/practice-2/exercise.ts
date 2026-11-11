import { defineExercise } from '../../../define'

const expected = `// Goal: import from \`./utils\` instead.

import { helper } from './utils'`

export default defineExercise(
  {
    id: 'change-in-quotes-3',
    activeFile: 'src/imports.ts',
    start: { line: 3, col: 27 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci\'./utils<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
