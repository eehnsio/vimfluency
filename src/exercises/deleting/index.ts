import type { Category } from '../types'
import deleteLineRepeat from './delete-line-repeat/lesson'
import deleteToChar from './delete-to-char/lesson'
import substituteLine from './substitute-line/lesson'

export const deleting: Category = {
  id: 'deleting',
  title: 'Deleting',
  description: 'Delete, repeat and replace lines.',
  lessons: [deleteLineRepeat, substituteLine, deleteToChar],
}
