import { allExercises, lessonOf } from '../exercises/registry'
import type { Exercise, Lesson } from '../exercises/types'
import { displayKeys, taughtKeys } from './lock'

/** Tangenterna en lektion lär ut: övningarnas kommandotangenter tillsammans. */
export function lessonKeys(lesson: Lesson): ReadonlySet<string> {
  const keys = new Set<string>()
  for (const exercise of lesson.exercises) {
    for (const key of taughtKeys(exercise.solution, exercise.allowedKeys)) keys.add(key)
  }
  return keys
}

/** Lektionens tangenter som man ser dem i "Keys in play". */
export function lessonDisplayKeys(lesson: Lesson): string[] {
  return [...new Set(lesson.exercises.flatMap((exercise) => displayKeys(exercise.solution, exercise.allowedKeys)))]
}

// Räknas en gång: kursen är statisk och ordningen kommer från registret.
const unlocked = new Map<string, ReadonlySet<string>>()
{
  const soFar = new Set<string>()
  let current: Lesson | undefined
  for (const exercise of allExercises) {
    const lesson = lessonOf(exercise)
    if (lesson && lesson !== current) {
      current = lesson
      for (const key of lessonKeys(lesson)) soFar.add(key)
    }
    unlocked.set(exercise.id, new Set(soFar))
  }
}

/**
 * Det man får använda i en övning: allt som lärts ut i tidigare lektioner plus
 * hela den egna lektionen, så att det man lärt sig följer med. En övning som
 * inte finns i kursen (tester) har bara sina egna tangenter.
 */
export function unlockedKeys(exercise: Exercise): ReadonlySet<string> {
  return unlocked.get(exercise.id) ?? taughtKeys(exercise.solution, exercise.allowedKeys)
}
