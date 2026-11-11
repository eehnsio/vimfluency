import { defineExercise } from '../../../define'

const expected = `// Goal: make the line read \`const total = price + tax\`.

const total = price + tax`

export default defineExercise(
  {
    id: 'insert-before-3',
    hints: ['Move to the last word first, then insert in front of it.'],
    activeFile: 'src/total.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: '3wiprice + <Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
