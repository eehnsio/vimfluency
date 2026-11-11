import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'

const lesson: Lesson = {
  id: 'move-left-right',
  title: 'Move left and right: h and l',
  instructions:
    '`h` moves one character left and `l` moves one character right.',
  exercises: [tryIt, practice1],
}

export default lesson
