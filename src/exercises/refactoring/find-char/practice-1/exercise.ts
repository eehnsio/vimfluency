import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'find-char-2',
    hints: ['`f` once, then `;` repeats it.'],
    activeFile: 'src/call.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 19 }, { type: 'contentUnchanged' }],
    solution: 'f,;',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
