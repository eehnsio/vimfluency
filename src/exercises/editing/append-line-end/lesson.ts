import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'append-line-end',
  title: 'Append at the end of the line: A',
  instructions:
    '`A` jumps to the end of the line and enters insert mode in one go.',
  exercises: [tryIt],
}

export default lesson
