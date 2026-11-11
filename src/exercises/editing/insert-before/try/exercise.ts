import { defineExercise } from '../../../define'

const expected = `// Goal: make the paragraph say \`Big Hello\`.

<p>Big Hello</p>`

export default defineExercise(
  {
    id: 'insert-before',
    hints: [
      'The cursor is already in place. Press `i`, type `Big `, then `Esc`.',
    ],
    activeFile: 'src/Hello.tsx',
    start: { line: 3, col: 4 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'iBig <Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
