import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'find-char',
  title: 'Find a character: f',
  instructions:
    '`f` followed by a character jumps forward to the next occurrence of it on the line. `;` repeats the jump and `,` repeats it backwards.',
  exercises: [tryIt],
}

export default lesson
