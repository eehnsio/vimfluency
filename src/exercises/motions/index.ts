import type { Category } from '../types'
import lineEnd from './line-end/exercise'
import lineStart from './line-start/exercise'
import wordBack from './word-back/exercise'
import wordEnd from './word-end/exercise'
import wordJumps from './word-jumps/exercise'

export const motions: Category = {
  id: 'motions',
  title: 'Motions',
  description: 'Move quickly by word and by line.',
  exercises: [wordJumps, wordBack, wordEnd, lineStart, lineEnd],
}
