import { defineExercise } from '../../../define'

const expected = `// Goal: delete the three \`<p>\` lines.

function App() {
  return (
    <div>
    </div>
  );
}`

export default defineExercise(
  {
    id: 'delete-line-repeat',
    hints: [
      '`dd` once, then `.` twice. `3dd` is also fine.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 6, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dd..',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
