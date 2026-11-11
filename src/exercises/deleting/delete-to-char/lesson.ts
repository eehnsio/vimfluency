import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'delete-to-char',
  title: 'Delete up to a character: dt',
  instructions:
    '`dt` followed by a character deletes up to, but not including, that character.',
  exercises: [tryIt],
}

export default lesson
