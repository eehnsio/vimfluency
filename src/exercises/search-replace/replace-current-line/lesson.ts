import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'replace-current-line',
  title: 'Replace on one line: :s',
  instructions:
    '`:s/old/new/` replaces on the current line only, while `:%s` covers the whole file.',
  exercises: [tryIt],
}

export default lesson
