import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'substitute-line',
  title: 'Replace a whole line: S',
  instructions:
    '`S` deletes the whole line and enters insert mode, which is quicker than `dd` followed by `O`.',
  exercises: [tryIt],
}

export default lesson
