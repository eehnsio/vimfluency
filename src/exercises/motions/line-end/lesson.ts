import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'line-end',
  title: 'End of the line: $',
  instructions:
    '`$` jumps to the last character of the line.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
