import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'go-to-line',
  title: 'Jump to a line number: :N',
  instructions:
    'Type `:` followed by a line number and press Enter to jump straight to that line. `:` always counts from the top of the file, whichever line numbers you show. Relative numbers on the left are distances for `j` and `k`, not line numbers. The real line number is always in the bottom right, as line:column.',
  exercises: [tryIt],
}

export default lesson
