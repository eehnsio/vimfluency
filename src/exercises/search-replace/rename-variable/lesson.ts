import type { Lesson } from '../../types'
import tryIt from './try/exercise'
import practice1 from './practice-1/exercise'

const lesson: Lesson = {
  id: 'rename-variable',
  title: 'Rename a variable',
  instructions:
    '`:%s/old/new/g` substitutes on all lines (the `%`) and every match on each line (the g at the end). Every occurrence changes, so check the result against the whole file.',
  exercises: [tryIt, practice1],
}

export default lesson
