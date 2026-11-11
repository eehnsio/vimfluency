import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'intro-show-numbers',
  title: 'Show line numbers',
  instructions:
    'The highlighted first line in the editor is always your goal. Vim starts without line numbers. `:set number` shows the number of every line. `:set relativenumber` shows how far away each line is instead, which is the number you will type in front of movements. Commands that start with `:` run when you press Enter. Your choice is used in every exercise, and you can switch it at the top of this column.',
  exercises: [tryIt],
}

export default lesson
