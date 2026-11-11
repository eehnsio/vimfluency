import type { Category } from '../types'
import introHideNumbers from './intro-hide-numbers/lesson'
import introLineNumbers from './intro-line-numbers/lesson'
import introModes from './intro-modes/lesson'
import introPosition from './intro-position/lesson'
import introShowNumbers from './intro-show-numbers/lesson'

export const intro: Category = {
  id: 'intro',
  title: 'Start here',
  description: 'A first look at the editor: line numbers, counts, position, modes and settings.',
  lessons: [introShowNumbers, introLineNumbers, introPosition, introModes, introHideNumbers],
}
