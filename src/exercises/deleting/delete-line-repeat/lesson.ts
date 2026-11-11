import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'delete-line-repeat',
  title: 'Delete lines and repeat: dd and .',
  instructions:
    '`dd` deletes the current line and `.` repeats the last change.',
  exercises: [tryIt],
}

export default lesson
