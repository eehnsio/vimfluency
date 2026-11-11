import type { Category } from '../types'
import changeInBraces from './change-in-braces/lesson'
import changeInParens from './change-in-parens/lesson'
import changeInQuotes from './change-in-quotes/lesson'
import findChar from './find-char/lesson'

export const refactoring: Category = {
  id: 'refactoring',
  title: 'Refactoring',
  description: 'Change code inside brackets and quotes, and jump to characters.',
  lessons: [changeInParens, changeInQuotes, changeInBraces, findChar],
}
