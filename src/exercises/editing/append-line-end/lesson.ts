import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'append-line-end',
  title: 'Append at the end of the line: A',
  instructions:
    '`A` jumps to the end of the line and enters insert mode in one go.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
