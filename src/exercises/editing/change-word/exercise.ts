import { defineExercise } from '../../define'

const expected = `// Goal: change \`Hello\` to \`World\`.

const greeting = 'World'`

export default defineExercise(
  {
    id: 'change-word',
    title: 'Change a word: cw',
    instructions:
      '`cw` deletes to the end of the word and enters insert mode. If you make a mistake, `u` undoes it.',
    hints: [
      'Place the cursor on the `H` (it already is), press `cw`, type `World`, then `Esc`.',
    ],
    activeFile: 'src/greeting.ts',
    start: { line: 3, col: 19 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'cwWorld<Esc>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
