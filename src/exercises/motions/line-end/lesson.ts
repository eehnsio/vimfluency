import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'line-end',
  title: 'End of the line: $',
  instructions:
    '`$` jumps to the last character of the line.',
  exercises: [tryIt],
}

export default lesson
