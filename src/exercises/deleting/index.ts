import type { Category } from '../types'
import deleteLineRepeat from './delete-line-repeat/exercise'
import deleteToChar from './delete-to-char/exercise'
import substituteLine from './substitute-line/exercise'

export const deleting: Category = {
  id: 'deleting',
  title: 'Deleting',
  description: 'Delete, repeat and replace lines.',
  exercises: [deleteLineRepeat, substituteLine, deleteToChar],
}
