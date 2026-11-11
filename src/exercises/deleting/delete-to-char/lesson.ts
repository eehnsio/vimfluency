import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'delete-to-char',
  title: 'Delete up to a character: dt',
  instructions:
    '`dt` followed by a character deletes up to, but not including, that character.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
