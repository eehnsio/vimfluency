import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'insert-before',
  title: 'Insert text: i',
  instructions:
    '`i` enters insert mode before the cursor and `Esc` returns to normal mode.',
  exercises: [tryIt],
}

export default lesson
