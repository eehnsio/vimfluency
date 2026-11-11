import { defineExercise } from '../../../define'

const expected = `// Goal: give the state variable the name \`total\` everywhere it is used.

import { useState } from 'react'

export function Tally() {
  const [total, update] = useState(0)
  const double = total * 2
  return <button onClick={() => update(total + 1)}>{total} / {double}</button>
}
`

export default defineExercise(
  {
    id: 'rename-variable',
    hints: ['Start the command with `:` and finish it with Enter.'],
    activeFile: 'src/Counter.tsx',
    start: { line: 1, col: 1 },
    checks: [{ type: 'contentEquals', expected }],
    solution: ':%s/count/total/g<CR>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
