import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'change-in-quotes',
  title: 'Change inside quotes: ci\' and ci"',
  instructions:
    '`ci\'` changes the text between the nearest single quotes, and `ci"` between double quotes.',
  exercises: [tryIt],
}

export default lesson
