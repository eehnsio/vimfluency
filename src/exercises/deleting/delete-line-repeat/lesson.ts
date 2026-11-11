import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'delete-line-repeat',
  title: 'Delete lines and repeat: dd and .',
  instructions:
    '`dd` deletes the current line and `.` repeats the last change.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
