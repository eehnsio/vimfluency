import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'insert-before',
  title: 'Insert text: i',
  instructions:
    '`i` enters insert mode before the cursor and `Esc` returns to normal mode.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
