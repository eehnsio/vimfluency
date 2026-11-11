import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'word-jumps',
  title: 'Jump between words',
  instructions:
    '`w` jumps to the start of the next word. A count in front of a motion repeats it, so `3w` jumps three words forward.',
  exercises: [tryIt],
}

export default lesson
