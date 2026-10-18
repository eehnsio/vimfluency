import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'line-end',
    title: 'End of the line: $',
    instructions:
      '`$` jumps to the last character of the line.',
    activeFile: 'src/App.tsx',
    start: { line: 4, col: 3 },
    checks: [{ type: 'cursorAt', line: 4, col: 21 }, { type: 'contentUnchanged' }],
    solution: '$',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
