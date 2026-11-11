import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'

const lesson: Lesson = {
  id: 'move-around',
  title: 'Put it together',
  instructions:
    'Combine `h`, `j`, `k` and `l` to reach any spot. Counts save keystrokes, but the order is up to you.',
  exercises: [tryIt, practice1],
}

export default lesson
