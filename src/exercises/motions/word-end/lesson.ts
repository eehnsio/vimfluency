import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'word-end',
  title: 'End of a word: e',
  instructions:
    '`e` jumps to the end of the current or next word.',
  exercises: [tryIt],
}

export default lesson
