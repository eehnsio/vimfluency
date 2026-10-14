import { defineExercise } from '../../define'

const expected = `// Goal: make the paragraph say \`Big Hello\`.
// \`i\` inserts before the cursor. \`Esc\` returns to normal mode.

<p>Big Hello</p>`

export default defineExercise(
  {
    id: 'insert-before',
    title: 'Insert text: i',
    instructions:
      '`i` enters insert mode before the cursor and `Esc` returns to normal mode. Make the paragraph say `Big Hello`.',
    hints: [
      'The cursor starts on the `H`. Press `i`, type `Big `, then `Esc`.',
    ],
    activeFile: 'src/Hello.tsx',
    start: { line: 4, col: 4 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'iBig <Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
