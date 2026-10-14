import type { Category } from '../types'
import renameVariable from './rename-variable/exercise'

export const searchReplace: Category = {
  id: 'search-replace',
  title: 'Search and replace',
  description: 'Find text in a file and change it in bulk.',
  exercises: [renameVariable],
}
