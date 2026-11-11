import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'change-word',
  title: 'Change a word: cw',
  instructions:
    '`cw` deletes to the end of the word and enters insert mode. If you make a mistake, `u` undoes it.',
  exercises: [tryIt],
}

export default lesson
