import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'matching-brace-2',
    hints: ['The inner pair is skipped: `%` finds the parenthesis that matches the one under the cursor.'],
    activeFile: 'src/total.ts',
    start: { line: 3, col: 18 },
    checks: [{ type: 'cursorAt', line: 3, col: 46 }, { type: 'contentUnchanged' }],
    solution: '%',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
