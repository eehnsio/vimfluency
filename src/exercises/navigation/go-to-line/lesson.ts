import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'

const lesson: Lesson = {
  id: 'go-to-line',
  title: 'Jump to a line number: :N',
  instructions:
    'Error messages, stack traces and review comments point at a line number. Type `:` followed by that number and press Enter to jump straight to the line. `:` always counts from the top of the file, whichever line numbers you show. Relative numbers on the left are distances for `j` and `k`, not line numbers. The real line number is always in the bottom right, as line:column.',
  exercises: [tryIt, practice1],
}

export default lesson
