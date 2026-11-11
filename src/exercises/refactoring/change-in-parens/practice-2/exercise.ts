import { defineExercise } from '../../../define'

const expected = `// Goal: call \`greet\` with \`name\` instead of the string.

greet(name)`

export default defineExercise(
  {
    id: 'change-in-parens-3',
    hints: ['`cib` does the same thing.'],
    activeFile: 'src/greet.ts',
    start: { line: 3, col: 8 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci(name<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
