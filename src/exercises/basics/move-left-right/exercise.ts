import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'move-left-right',
    title: 'Move left and right: h and l',
    instructions:
      '`h` moves one character left and `l` moves one character right.',
    hints: ['A count works here too: `5l` moves five characters right.'],
    activeFile: 'src/greeting.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'cursorAt', line: 3, col: 18 }, { type: 'contentUnchanged' }],
    solution: '17l',
    allowedKeys: 'h',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
