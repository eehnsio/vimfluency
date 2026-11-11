import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'word-back',
  title: 'Back one word: b',
  instructions:
    '`b` jumps back to the start of the previous word. A count in front repeats it, as with `w`.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
