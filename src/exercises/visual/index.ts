import type { Category } from '../types'
import visualInsideParens from './visual-inside-parens/exercise'
import visualLines from './visual-lines/exercise'

export const visual: Category = {
  id: 'visual',
  title: 'Visual mode',
  description: 'Select text first, then act on it.',
  exercises: [visualInsideParens, visualLines],
}
