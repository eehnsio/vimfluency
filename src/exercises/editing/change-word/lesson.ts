import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'change-word',
  title: 'Change a word: cw',
  instructions:
    '`cw` deletes to the end of the word and enters insert mode. If you make a mistake, `u` undoes it.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
