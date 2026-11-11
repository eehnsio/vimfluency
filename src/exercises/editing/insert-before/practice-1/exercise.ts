import { defineExercise } from '../../../define'

const expected = `// Goal: make the paragraph say \`Hello there\`.

<p>Hello there</p>`

export default defineExercise(
  {
    id: 'insert-before-2',
    hints: ['The cursor is on the `<` of the closing tag. `i` inserts before it.'],
    activeFile: 'src/Hello.tsx',
    start: { line: 3, col: 9 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'i there<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
