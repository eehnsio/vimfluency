import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'change-in-braces',
  title: 'Change inside braces: ci{',
  instructions:
    '`ci{` changes everything between the nearest curly braces.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
