import { basics } from './basics'
import { deleting } from './deleting'
import { editing } from './editing'
import { motions } from './motions'
import { navigation } from './navigation'
import { refactoring } from './refactoring'
import { searchReplace } from './search-replace'
import { visual } from './visual'
import type { Category, Exercise } from './types'

/** Ordningen här är kategoriordningen i UI:t. */
export const categories: Category[] = [basics, motions, navigation, editing, searchReplace, refactoring, deleting, visual]

export const allExercises: Exercise[] = categories.flatMap((category) => category.exercises)

export function getExercise(id: string): Exercise | undefined {
  return allExercises.find((exercise) => exercise.id === id)
}

export function nextExercise(id: string): Exercise | undefined {
  const index = allExercises.findIndex((exercise) => exercise.id === id)
  return index === -1 ? undefined : allExercises[index + 1]
}
