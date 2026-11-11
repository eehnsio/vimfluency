import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'visual-lines',
  title: 'Select lines: V',
  instructions:
    '`V` selects whole lines. `j` extends the selection and `d` deletes it.',
  exercises: [tryIt],
}

export default lesson
