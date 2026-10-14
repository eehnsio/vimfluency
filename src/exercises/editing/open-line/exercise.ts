import { defineExercise } from '../../define'

const expected = `// Goal: add a third import, \`import { useMemo } from 'react'\`, below the cursor line.
// \`o\` opens a new line below. \`O\` opens one above.

import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'`

export default defineExercise(
  {
    id: 'open-line',
    title: 'Open a new line: o',
    instructions:
      '`o` opens a new line below the cursor and enters insert mode. Add an import for `useMemo` below the cursor line.',
    hints: [
      '`O` (capital) opens a line above instead.',
    ],
    activeFile: 'src/imports.ts',
    start: { line: 5, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'oimport { useMemo } from \'react\'<Esc>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
