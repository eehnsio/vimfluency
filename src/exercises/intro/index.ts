import type { Category } from '../types'
import introHideNumbers from './intro-hide-numbers/exercise'
import introShowNumbers from './intro-show-numbers/exercise'
import introLineNumbers from './intro-line-numbers/exercise'
import introModes from './intro-modes/exercise'
import introPosition from './intro-position/exercise'

export const intro: Category = {
  id: 'intro',
  title: 'Start here',
  description: 'A first look at the editor: line numbers, counts, position, modes and settings.',
  exercises: [introShowNumbers, introLineNumbers, introPosition, introModes, introHideNumbers],
}
