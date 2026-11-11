import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'visual-inside-parens',
  title: 'Select inside parentheses: vi(',
  instructions:
    '`v` starts visual mode, `i(` extends the selection to the contents of the parentheses and `d` deletes it. The same works with `i{` and `i\'`.',
  exercises: [tryIt],
}

export default lesson
