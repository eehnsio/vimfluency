import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'change-in-braces',
  title: 'Change inside braces: ci{',
  instructions:
    '`ci{` changes everything between the nearest curly braces.',
  exercises: [tryIt],
}

export default lesson
