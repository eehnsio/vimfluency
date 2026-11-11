import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'word-back',
  title: 'Back one word: b',
  instructions:
    'The cursor starts on `shipping`. `b` jumps back to the start of the previous word.',
  exercises: [tryIt],
}

export default lesson
