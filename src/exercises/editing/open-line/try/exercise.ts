import { defineExercise } from '../../../define'

const expected = `// Goal: add a third import, \`import { useMemo } from 'react'\`, below the cursor line.

import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'`

export default defineExercise(
  {
    id: 'open-line',
    hints: ['Type the new import exactly like the line above it, with `useMemo` instead of `useEffect`.'],
    activeFile: 'src/imports.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'oimport { useMemo } from \'react\'<Esc>',
    allowedKeys: 'O',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
