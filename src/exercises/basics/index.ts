import type { Category } from '../types'
import moveAround from './move-around/exercise'
import moveLeftRight from './move-left-right/exercise'
import moveUpDown from './move-up-down/exercise'

export const basics: Category = {
  id: 'basics',
  title: 'Basics',
  description: 'Move around with the home row: h, j, k and l.',
  exercises: [moveUpDown, moveLeftRight, moveAround],
}
