import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'move-left-right',
    title: 'Move left and right: h and l',
    instructions:
      '`h` moves one character left and `l` moves one character right. Put the cursor on the opening quote of `\'hello\'`.',
    hints: ['A count works here too: `5l` moves five characters right.'],
    activeFile: 'src/greeting.ts',
    start: { line: 5, col: 1 },
    checks: [{ type: 'cursorAt', line: 5, col: 18 }, { type: 'contentUnchanged' }],
    solution: '17l',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
