import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'line-start',
  title: 'Start of the line: ^',
  instructions:
    '`^` jumps to the first non-blank character of the line, and `0` to the very first column.',
  exercises: [tryIt],
}

export default lesson
