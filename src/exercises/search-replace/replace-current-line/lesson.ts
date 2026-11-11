import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'
import practice2 from './practice-2/exercise'

const lesson: Lesson = {
  id: 'replace-current-line',
  title: 'Replace on one line: :s',
  instructions:
    '`:s/old/new/` replaces on the current line only, while `:%s` covers the whole file.',
  exercises: [tryIt, practice1, practice2],
}

export default lesson
