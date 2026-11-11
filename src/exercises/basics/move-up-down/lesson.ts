import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'

const lesson: Lesson = {
  id: 'move-up-down',
  title: 'Move down and up: j and k',
  instructions:
    'Vim keeps your fingers on the home row. `j` moves down and `k` moves up.',
  exercises: [tryIt, practice1],
}

export default lesson
