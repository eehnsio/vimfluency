import type { Category } from '../types'
import appendLineEnd from './append-line-end/exercise'
import changeWord from './change-word/exercise'
import insertBefore from './insert-before/exercise'
import openLine from './open-line/exercise'

export const editing: Category = {
  id: 'editing',
  title: 'Editing',
  description: 'Insert, append and change text.',
  exercises: [insertBefore, appendLineEnd, openLine, changeWord],
}
