import { defineExercise } from '../../../define'

export default defineExercise(
  {
    id: 'find-char',
    hints: ['The target is the first `w` on the line, so one jump is enough.'],
    activeFile: 'src/message.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 24 }, { type: 'contentUnchanged' }],
    solution: 'fw',
    allowedKeys: ';,',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
