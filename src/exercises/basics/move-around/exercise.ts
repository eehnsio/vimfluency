import { defineExercise } from '../../define'

export default defineExercise(
  {
    id: 'move-around',
    title: 'Put it together',
    instructions:
      'Combine `h`, `j`, `k` and `l` to reach the `{` in `<p>{label}</p>`. Counts save keystrokes, but the order is up to you.',
    hints: ['Go down first, then right.'],
    activeFile: 'src/Label.tsx',
    start: { line: 4, col: 1 },
    checks: [{ type: 'cursorAt', line: 6, col: 13 }, { type: 'contentUnchanged' }],
    solution: '2j12l',
    allowedKeys: 'hk',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
