import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'file-bottom',
    title: 'Bottom of the file: G',
    instructions:
      '`G` jumps to the last line of the file and `gg` to the first. Go to the last line.',
    activeFile: 'src/hooks.ts',
    start: { line: 7, col: 1 },
    checks: [{ type: 'cursorAt', line: 13 }, { type: 'contentUnchanged' }],
    solution: 'G',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
