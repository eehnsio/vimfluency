import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'intro-modes',
  title: 'Which mode am I in?',
  instructions:
    'The bottom left of the window shows the mode. In NORMAL mode keys are commands. `i` enters INSERT mode, where keys type text, and `Esc` takes you back. In NORMAL mode, `u` undoes the last change.',
  exercises: [tryIt],
}

export default lesson
