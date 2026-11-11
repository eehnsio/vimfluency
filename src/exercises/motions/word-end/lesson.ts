import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'word-end',
  title: 'End of a word: e',
  instructions:
    '`e` jumps to the end of the current or next word.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
