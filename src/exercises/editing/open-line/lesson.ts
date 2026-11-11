import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'open-line',
  title: 'Open a new line: o and O',
  instructions:
    '`o` opens a new line below the cursor and enters insert mode. `O` (capital) opens one above instead.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
