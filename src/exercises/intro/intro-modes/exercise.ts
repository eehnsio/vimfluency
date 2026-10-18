import { defineExercise } from '../../define'

const expected = `// Goal: type the word hello on the empty line below, then go back to NORMAL mode.

hello`

export default defineExercise(
  {
    id: 'intro-modes',
    title: 'Which mode am I in?',
    instructions:
      'The bottom left of the window shows the mode. In NORMAL mode keys are commands. `i` enters INSERT mode, where keys type text, and `Esc` takes you back.',
    hints: [
      '`i`, then `hello`, then `Esc`.',
    ],
    activeFile: 'src/hello.ts',
    start: { line: 3, col: 1 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'ihello<Esc>',
    allowedKeys: 'u',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
