import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'matching-brace',
  title: 'Jump to the matching brace',
  instructions:
    '`%` moves between matching brackets, braces and parentheses with a single key.',
  exercises: [tryIt],
}

export default lesson
