import type { Category } from '../types'
import fileEnds from './file-ends/lesson'
import goToLine from './go-to-line/lesson'
import matchingBrace from './matching-brace/lesson'

export const navigation: Category = {
  id: 'navigation',
  title: 'Navigation',
  description: 'Find your way around a file.',
  lessons: [fileEnds, goToLine, matchingBrace],
}
