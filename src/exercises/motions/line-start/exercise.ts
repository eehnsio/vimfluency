import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'line-start',
    title: 'Start of the line: ^',
    instructions:
      '`^` jumps to the first non-blank character of the line, and `0` to the very first column. Put the cursor on the `r` of `return`.',
    hints: [
      '`0` goes to column 1, which is on the indentation here. Use `^`.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 5, col: 13 },
    checks: [{ type: 'cursorAt', line: 5, col: 3 }, { type: 'contentUnchanged' }],
    solution: '^',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
