import type { Category } from '../types'
import renameVariable from './rename-variable/lesson'
import replaceCurrentLine from './replace-current-line/lesson'
import searchNext from './search-next/lesson'

export const searchReplace: Category = {
  id: 'search-replace',
  title: 'Search and replace',
  description: 'Find text in a file and change it in bulk.',
  lessons: [searchNext, replaceCurrentLine, renameVariable],
}
