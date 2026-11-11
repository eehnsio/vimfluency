import type { Lesson } from '../../types'
import tryIt from './try/exercise'

const lesson: Lesson = {
  id: 'intro-hide-numbers',
  title: 'Everything can be configured',
  instructions:
    'Every option you turn on with `:set` is turned off again by putting no in front: `number` becomes `nonumber` and `relativenumber` becomes `norelativenumber`. This only lasts for the exercise. Your own choice comes back in the next one.',
  exercises: [tryIt],
}

export default lesson
