import type { Category } from '../types'
import changeInBraces from './change-in-braces/exercise'
import changeInParens from './change-in-parens/exercise'
import changeInQuotes from './change-in-quotes/exercise'
import findChar from './find-char/exercise'

export const refactoring: Category = {
  id: 'refactoring',
  title: 'Refactoring',
  description: 'Change code inside brackets and quotes, and jump to characters.',
  exercises: [changeInParens, changeInQuotes, changeInBraces, findChar],
}
