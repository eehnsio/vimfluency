import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'matching-brace',
    title: 'Jump to the matching brace',
    instructions:
      '`%` moves between matching brackets, braces and parentheses with a single key.',
    hints: ['The key is `%`, which is `Shift+5` on most layouts.'],
    activeFile: 'src/Greeting.tsx',
    start: { line: 2, col: 54 },
    checks: [{ type: 'cursorAt', line: 7, col: 1 }, { type: 'contentUnchanged' }],
    solution: '%',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
