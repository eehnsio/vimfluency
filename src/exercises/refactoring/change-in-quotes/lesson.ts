import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'change-in-quotes',
  title: 'Change inside quotes: ci\' and ci"',
  instructions:
    '`ci\'` changes the text between the nearest single quotes, and `ci"` between double quotes.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
