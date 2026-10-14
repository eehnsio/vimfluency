import { defineExercise } from '../../define'

const expected = `// Goal: delete the three \`<p>\` lines.
// \`dd\` deletes a line. \`.\` repeats the last change.

function App() {
  return (
    <div>
    </div>
  );
}`

export default defineExercise(
  {
    id: 'delete-line-repeat',
    title: 'Delete lines and repeat: dd and .',
    instructions:
      '`dd` deletes the current line and `.` repeats the last change. Delete the three `<p>` lines.',
    hints: [
      '`dd` once, then `.` twice. `3dd` is also fine.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 7, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'dd..',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
