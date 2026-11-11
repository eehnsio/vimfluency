import type { Category } from '../types'
import appendLineEnd from './append-line-end/lesson'
import changeWord from './change-word/lesson'
import insertBefore from './insert-before/lesson'
import openLine from './open-line/lesson'

export const editing: Category = {
  id: 'editing',
  title: 'Editing',
  description: 'Insert, append and change text.',
  lessons: [insertBefore, appendLineEnd, openLine, changeWord],
}
