import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'intro-position',
    title: 'Where am I?',
    instructions:
      'The bottom right of the window shows your position as line:column. Move the cursor onto the `<` of `<p>` using `j` and `l`.',
    hints: [
      'Counts work here: `2j` moves two lines down and `4l` moves four columns right.',
    ],
    activeFile: 'src/App.tsx',
    start: { line: 5, col: 1 },
    checks: [{ type: 'cursorAt', line: 7, col: 5 }, { type: 'contentUnchanged' }],
    solution: '2j4l',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
