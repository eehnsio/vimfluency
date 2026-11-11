import type { Lesson } from '../../types'
import bottom from './try/exercise'
import top from './practice-1/exercise'

const lesson: Lesson = {
  id: 'file-ends',
  title: 'Bottom and top of the file: G and gg',
  instructions:
    '`G` jumps to the last line of the file and `gg` to the first. Both take a count: `5G` and `5gg` jump to line 5.',
  exercises: [bottom, top],
}

export default lesson
