import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'matching-brace',
    title: 'Jump to the matching brace',
    instructions:
      'The cursor is on the `{` that opens the function body. Jump to the `}` that closes it with a single key. `%` moves between matching brackets, braces and parentheses.',
    hints: ['The key is `%`, which is `Shift+5` on most layouts.'],
    activeFile: 'src/Greeting.tsx',
    start: { line: 1, col: 54 },
    checks: [{ type: 'cursorAt', line: 6, col: 1 }],
    solution: '%',
    par: 1,
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
