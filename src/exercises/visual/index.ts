import type { Category } from '../types'
import visualInsideParens from './visual-inside-parens/lesson'
import visualLines from './visual-lines/lesson'

export const visual: Category = {
  id: 'visual',
  title: 'Visual mode',
  description: 'Select text first, then act on it.',
  lessons: [visualInsideParens, visualLines],
}
