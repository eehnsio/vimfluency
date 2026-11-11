import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'visual-lines',
  title: 'Select lines: V',
  instructions:
    '`V` selects whole lines. `j` extends the selection and `d` deletes it.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
