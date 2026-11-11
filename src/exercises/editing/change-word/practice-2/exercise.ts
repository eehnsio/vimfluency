import { defineExercise } from '../../../define'

const expected = `// Goal: change \`Hello\` to \`Goodbye\`.

const greeting = 'Goodbye world'`

export default defineExercise(
  {
    id: 'change-word-3',
    hints: ['Get to the word first: `4w` takes you there.'],
    activeFile: 'src/greeting.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: '4wcwGoodbye<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
