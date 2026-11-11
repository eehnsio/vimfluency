import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'line-start',
  title: 'Start of the line: ^',
  instructions:
    '`^` jumps to the first non-blank character of the line, and `0` to the very first column.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
