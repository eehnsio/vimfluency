import { defineExercise } from '../../../define'

const expected = `// Goal: empty the braces so the line reads \`const style = {}\`.

const style = {}`

export default defineExercise(
  {
    id: 'visual-inside-parens-2',
    activeFile: 'src/style.ts',
    start: { line: 3, col: 17 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'vi{d',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
