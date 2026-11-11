import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'open-line',
  title: 'Open a new line: o and O',
  instructions:
    '`o` opens a new line below the cursor and enters insert mode. `O` (capital) opens one above instead.',
  exercises: [tryIt],
}

export default lesson
