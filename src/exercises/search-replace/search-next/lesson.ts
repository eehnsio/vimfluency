import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'search-next',
  title: 'Search: / and n',
  instructions:
    '`/` searches forward, `Enter` confirms, `n` jumps to the next match and `N` to the previous.',
  exercises: [tryIt],
}

export default lesson
