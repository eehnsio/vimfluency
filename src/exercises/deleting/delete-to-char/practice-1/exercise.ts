import { defineExercise } from '../../../define'

const expected = `// Goal: remove the \`TODO: \` prefix so the comment reads \`// fix this\`.

// fix this`

export default defineExercise(
  {
    id: 'delete-to-char-2',
    hints: ['`dt` followed by `f` deletes up to the `f` of fix.'],
    activeFile: 'src/todo.ts',
    start: { line: 3, col: 4 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dtf',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
