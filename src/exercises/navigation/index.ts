import type { Category } from '../types'
import matchingBrace from './matching-brace/exercise'

export const navigation: Category = {
  id: 'navigation',
  title: 'Navigation',
  description: 'Find your way around code.',
  exercises: [matchingBrace],
}
