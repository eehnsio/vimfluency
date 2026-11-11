import { useState } from 'react'
import { Kbd } from '../Kbd'
import type { Category, Lesson } from '../../exercises/types'

/** "Move down and up: j and k" → namn och tangenter, så att tangenterna kan visas som chips. */
function splitTitle(title: string): { name: string; keys: string[] } {
  const index = title.indexOf(': ')
  if (index === -1) return { name: title, keys: [] }
  return { name: title.slice(0, index), keys: title.slice(index + 2).split(' and ') }
}

interface Props {
  categories: Category[]
  selectedId: string
  completedIds: Set<string>
  /** Klarade där lösningen visades. */
  assistedIds: Set<string>
  /** Anropas med övningen att öppna: den första i lektionen som inte är klar. */
  onSelect: (id: string) => void
}

/**
 * Hela kursen som lektioner. Kategorin med den valda lektionen är öppen, de
 * andra visar bara hur många lektioner som är klara. Användaren kan öppna och
 * stänga vilken som helst, och valet gäller tills sidan laddas om.
 */
export function CourseOutline({ categories, selectedId, completedIds, assistedIds, onSelect }: Props) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const exercisesOf = (lessons: Lesson[]) => lessons.flatMap((lesson) => lesson.exercises)
  const doneIn = (lessons: Lesson[]) => exercisesOf(lessons).filter((exercise) => completedIds.has(exercise.id)).length
  const lessonDone = (lesson: Lesson) => doneIn([lesson]) === lesson.exercises.length
  const allLessons = categories.flatMap((category) => category.lessons)
  const total = exercisesOf(allLessons).length
  const done = doneIn(allLessons)

  return (
    <nav aria-label="Lessons" className="flex min-h-0 flex-col">
      <header className="px-4 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Exercises completed"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="h-1 flex-1 overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full origin-left bg-success transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${total === 0 ? 0 : done / total})` }}
            />
          </div>
          <span className="font-mono text-xs text-fg-muted">
            {done}/{total}
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-1 overflow-y-auto px-2 pb-4">
        {categories.map((category) => {
          const lessonsDone = category.lessons.filter(lessonDone).length
          const finished = lessonsDone === category.lessons.length
          const holdsSelected = exercisesOf(category.lessons).some((exercise) => exercise.id === selectedId)
          const open = toggled[category.id] ?? holdsSelected
          const listId = `outline-${category.id}`

          return (
            <section key={category.id}>
              <h2>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={listId}
                  onClick={() => setToggled((current) => ({ ...current, [category.id]: !open }))}
                  className={`flex w-full items-center gap-2 rounded-panel px-2 py-1.5 text-left text-xs font-semibold tracking-wide uppercase transition-colors duration-150 hover:bg-border hover:text-fg focus-visible:outline-2 focus-visible:outline-accent ${
                    holdsSelected ? 'text-fg' : 'text-fg-muted'
                  }`}
                >
                  <span aria-hidden className="w-2.5 text-[0.6rem] text-fg-muted">
                    {open ? '▾' : '▸'}
                  </span>
                  <span className="flex-1">{category.title}</span>
                  <span
                    aria-label={`${lessonsDone} of ${category.lessons.length} lessons completed`}
                    className={`font-mono font-normal tracking-normal ${finished ? 'text-success' : 'text-fg-muted'}`}
                  >
                    {finished ? '✓' : `${lessonsDone}/${category.lessons.length}`}
                  </span>
                </button>
              </h2>
              {open && (
                <ul id={listId} className="mt-0.5 mb-2 flex flex-col">
                  {category.lessons.map((lesson) => {
                    const doneHere = doneIn([lesson])
                    const completed = doneHere === lesson.exercises.length
                    const assisted = completed && lesson.exercises.some((exercise) => assistedIds.has(exercise.id))
                    const selected = lesson.exercises.some((exercise) => exercise.id === selectedId)
                    const partial = !completed && lesson.exercises.length > 1 && doneHere > 0
                    const target = lesson.exercises.find((exercise) => !completedIds.has(exercise.id)) ?? lesson.exercises[0]
                    const { name, keys } = splitTitle(lesson.title)
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          aria-current={selected ? 'true' : undefined}
                          onClick={() => onSelect(target.id)}
                          className={`flex w-full items-start gap-2 rounded-panel py-1.5 pr-2 pl-6 text-left text-sm transition-colors duration-150 hover:bg-border focus-visible:outline-2 focus-visible:outline-accent ${
                            selected ? 'bg-border font-medium text-fg' : 'text-fg-muted hover:text-fg'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`w-3 shrink-0 text-center ${
                              assisted ? 'text-fg-muted' : completed ? 'text-success' : selected ? 'text-accent' : 'text-fg-muted/50'
                            }`}
                          >
                            {completed ? '✓' : selected ? '›' : '·'}
                          </span>
                          <span aria-hidden className="flex flex-1 items-baseline gap-2">
                            <span className="flex-1">{name}</span>
                            {partial && (
                              <span className="font-mono text-xs text-fg-muted">
                                {doneHere}/{lesson.exercises.length}
                              </span>
                            )}
                            {keys.map((key) => (
                              <Kbd key={key}>{key}</Kbd>
                            ))}
                          </span>
                          <span className="sr-only">
                            {lesson.title}
                            {completed && ` ${assisted ? '(completed with help)' : '(completed)'}`}
                            {partial && ` (${doneHere} of ${lesson.exercises.length} completed)`}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </nav>
  )
}
