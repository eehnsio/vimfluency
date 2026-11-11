import { defineExercise } from '../../../define'

const expected = `// Goal: change \`Hello\` to \`World\`.

const greeting = 'World'`

export default defineExercise(
  {
    id: 'change-word',
    hints: [
      'The cursor is already on the first letter. Press `cw`, type `World`, then `Esc`.',
    ],
    activeFile: 'src/greeting.ts',
    start: { line: 3, col: 19 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'cwWorld<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
