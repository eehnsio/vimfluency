import { defineExercise } from '../../define'

const expected = `// Goal: change the title to \`Update name\`.
// \`ci'\` changes the text inside single quotes. \`ci"\` does the same for double quotes.

<button title='Update name'>Go</button>`

export default defineExercise(
  {
    id: 'change-in-quotes',
    title: 'Change inside quotes: ci\'',
    instructions:
      '`ci\'` changes the text between the nearest single quotes. Change the title to `Update name`.',
    hints: [
      'Use `ci"` for double quotes.',
    ],
    activeFile: 'src/Button.tsx',
    start: { line: 4, col: 16 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ci\'Update name<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
