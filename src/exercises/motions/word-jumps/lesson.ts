import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'word-jumps',
  title: 'Jump between words',
  instructions:
    '`w` jumps to the start of the next word. A count in front of a motion repeats it, so `3w` jumps three words forward.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
