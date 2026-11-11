import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'visual-inside-parens',
  title: 'Select inside parentheses: vi(',
  instructions:
    '`v` starts visual mode, `i(` extends the selection to the contents of the parentheses and `d` deletes it. The same works with `i{` and `i\'`.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
