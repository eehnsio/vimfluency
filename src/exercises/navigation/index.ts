import type { Category } from '../types'
import fileBottom from './file-bottom/exercise'
import fileTop from './file-top/exercise'
import goToLine from './go-to-line/exercise'
import matchingBrace from './matching-brace/exercise'

export const navigation: Category = {
  id: 'navigation',
  title: 'Navigation',
  description: 'Find your way around a file.',
  exercises: [fileBottom, fileTop, goToLine, matchingBrace],
}
