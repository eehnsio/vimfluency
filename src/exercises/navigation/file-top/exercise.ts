import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'file-top',
    title: 'Top of the file: gg',
    instructions:
      '`gg` jumps to the first line of the file.',
    activeFile: 'src/hooks.ts',
    start: { line: 8, col: 1 },
    checks: [{ type: 'cursorAt', line: 1 }, { type: 'contentUnchanged' }],
    solution: 'gg',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
