import type { Category } from '../types'
import moveAround from './move-around/lesson'
import moveLeftRight from './move-left-right/lesson'
import moveUpDown from './move-up-down/lesson'

export const basics: Category = {
  id: 'basics',
  title: 'Basics',
  description: 'Move around with the home row: h, j, k and l.',
  lessons: [moveUpDown, moveLeftRight, moveAround],
}
