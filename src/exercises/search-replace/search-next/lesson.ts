import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'search-next',
  title: 'Search: / and n',
  instructions:
    '`/` searches forward, `Enter` confirms, `n` jumps to the next match and `N` to the previous.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
