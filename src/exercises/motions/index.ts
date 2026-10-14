import type { Category } from '../types'
import wordJumps from './word-jumps/exercise'

export const motions: Category = {
  id: 'motions',
  title: 'Motions',
  description: 'Move around quickly without leaving the home row.',
  exercises: [wordJumps],
}
