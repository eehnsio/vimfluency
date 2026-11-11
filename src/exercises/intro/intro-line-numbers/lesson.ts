import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'

const lesson: Lesson = {
  id: 'intro-line-numbers',
  title: 'Jump with a count',
  instructions:
    '`j` moves down one line and `k` moves up. A count in front repeats the move. With relative numbers, the number next to a line in the column on the left (the gutter) is exactly that count. With absolute numbers, it is the target line minus your line.',
  exercises: [tryIt, practice1],
}

export default lesson
