import type { Category } from '../types'
import lineEnd from './line-end/lesson'
import lineStart from './line-start/lesson'
import wordBack from './word-back/lesson'
import wordEnd from './word-end/lesson'
import wordJumps from './word-jumps/lesson'

export const motions: Category = {
  id: 'motions',
  title: 'Motions',
  description: 'Move quickly by word and by line.',
  lessons: [wordJumps, wordBack, wordEnd, lineStart, lineEnd],
}
