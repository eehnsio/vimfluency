import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'word-back',
  title: 'Back one word: b',
  instructions:
    'The cursor starts on `shipping`. `b` jumps back to the start of the previous word.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
