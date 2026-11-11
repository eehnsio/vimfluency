import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'intro-position',
  title: 'Where am I?',
  instructions:
    'The bottom right of the window shows your position as line:column. `j` moves down and `l` moves right.',
  exercises: [tryIt],
}

export default lesson
