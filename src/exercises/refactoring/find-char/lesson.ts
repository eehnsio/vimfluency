import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'find-char',
  title: 'Find a character: f',
  instructions:
    '`f` followed by a character jumps forward to the next occurrence of it on the line. `;` repeats the jump and `,` repeats it backwards.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
