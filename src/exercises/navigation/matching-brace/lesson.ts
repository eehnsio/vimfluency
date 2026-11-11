import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'matching-brace',
  title: 'Jump to the matching brace',
  instructions:
    '`%` moves between matching brackets, braces and parentheses with a single key.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
