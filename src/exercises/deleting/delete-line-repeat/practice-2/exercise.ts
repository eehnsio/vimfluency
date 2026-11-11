import { defineExercise } from '../../../define'

const expected = `// Goal: delete the three unused imports, leaving only \`useState\`.

import { useState } from 'react'

export const hooks = 4`

export default defineExercise(
  {
    id: 'delete-line-repeat-3',
    hints: ['A count works on `dd` too, or repeat with `.`.'],
    activeFile: 'src/hooks.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: '3dd',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
