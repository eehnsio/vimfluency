import { defineExercise } from '../../../define'

const expected = `// Goal: add \`import { useState } from 'react'\` above the cursor line.

import { useState } from 'react'
import { useEffect } from 'react'`

export default defineExercise(
  {
    id: 'open-line-2',
    hints: ['`O` is the capital letter.'],
    activeFile: 'src/imports.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'Oimport { useState } from \'react\'<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
