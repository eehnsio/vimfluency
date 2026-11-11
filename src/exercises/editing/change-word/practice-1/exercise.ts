import { defineExercise } from '../../../define'

const expected = `// Goal: change \`useState\` to \`useReducer\`.

const [state, dispatch] = useReducer(reducer, initial)`

export default defineExercise(
  {
    id: 'change-word-2',
    activeFile: 'src/reducer.ts',
    start: { line: 3, col: 27 },
    checks: [{ type: 'contentEquals', expected }, { type: 'mode', mode: 'normal' }],
    solution: 'cwuseReducer<Esc>',
  },
  import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true }),
)
