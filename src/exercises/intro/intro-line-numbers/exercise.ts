import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'intro-line-numbers',
    title: 'Jump with a count',
    instructions:
      '`j` moves down one line and `k` moves up. A count in front repeats the move. With relative numbers, the number next to a line in the column on the left (the gutter) is exactly that count. With absolute numbers, it is the target line minus your line.',
    hints: ['The count goes before the motion.', 'Press `3` and then `j`.'],
    activeFile: 'src/App.tsx',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 6 }, { type: 'contentUnchanged' }],
    solution: '3j',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
