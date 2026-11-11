import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'change-in-parens',
  title: 'Change inside parentheses: ci(',
  instructions:
    '`ci(` changes everything between the nearest parentheses, wherever the cursor is inside them. `cib` is the same command: b for bracket.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
