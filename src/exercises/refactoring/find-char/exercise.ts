import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'find-char',
    title: 'Find a character: f',
    instructions:
      '`f` followed by a character jumps forward to the next occurrence of it on the line. Land on the `w` of `world`.',
    hints: [
      '`;` repeats the last `f` and `,` repeats it backwards.',
    ],
    activeFile: 'src/message.ts',
    start: { line: 4, col: 1 },
    checks: [{ type: 'cursorAt', line: 4, col: 24 }, { type: 'contentUnchanged' }],
    solution: 'fw',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
