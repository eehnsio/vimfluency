import { useState } from 'react'
import type { Category } from '../../exercises/types'

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
  onSelect: (id: string) => void
}

/**
 * Hela kursen, alltid synlig. Kategorin med den valda övningen är öppen, de
 * andra visar bara hur många som är klara. Användaren kan öppna och stänga
 * vilken som helst, och valet gäller tills sidan laddas om.
 */
export function CourseOutline({ categories, selectedId, completedIds, assistedIds, onSelect }: Props) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const total = categories.reduce((sum, category) => sum + category.exercises.length, 0)
  const done = categories.reduce(
    (sum, category) => sum + category.exercises.filter((exercise) => completedIds.has(exercise.id)).length,
    0,
  )

  return (
    <nav aria-label="Exercises" className="flex min-h-0 flex-col">
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
              className="h-full origin-left bg-success transition-transform duration-200 ease-out"
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
          const doneHere = category.exercises.filter((exercise) => completedIds.has(exercise.id)).length
          const finished = doneHere === category.exercises.length
          const holdsSelected = category.exercises.some((exercise) => exercise.id === selectedId)
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
                    aria-label={`${doneHere} of ${category.exercises.length} completed`}
                    className={`font-mono font-normal tracking-normal ${finished ? 'text-success' : 'text-fg-muted'}`}
                  >
                    {finished ? '✓' : `${doneHere}/${category.exercises.length}`}
                  </span>
                </button>
              </h2>
              {open && (
                <ul id={listId} className="mt-0.5 mb-2 flex flex-col">
                  {category.exercises.map((exercise) => {
                    const completed = completedIds.has(exercise.id)
                    const assisted = completed && assistedIds.has(exercise.id)
                    const selected = exercise.id === selectedId
                    return (
                      <li key={exercise.id}>
                        <button
                          type="button"
                          aria-current={selected ? 'true' : undefined}
                          onClick={() => onSelect(exercise.id)}
                          className={`flex w-full items-start gap-2 rounded-panel py-1.5 pr-2 pl-6 text-left text-sm transition-colors duration-150 hover:bg-border focus-visible:outline-2 focus-visible:outline-accent ${
                            selected ? 'bg-border font-medium text-fg' : 'text-fg-muted hover:text-fg'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`w-3 shrink-0 text-center ${
                              assisted ? 'text-fg-muted' : completed ? 'text-success' : selected ? 'text-accent' : 'text-border'
                            }`}
                          >
                            {completed ? '✓' : selected ? '›' : '·'}
                          </span>
                          <span aria-hidden className="flex flex-1 items-baseline gap-2">
                            <span className="flex-1">{splitTitle(exercise.title).name}</span>
                            {splitTitle(exercise.title).keys.map((key) => (
                              <kbd key={key} className="rounded bg-term-bg px-1 font-mono text-xs text-term-fg">
                                {key}
                              </kbd>
                            ))}
                          </span>
                          <span className="sr-only">
                            {exercise.title}
                            {completed && (
                              <>
                                {' '}
                                <span className="sr-only">{assisted ? '(completed with help)' : '(completed)'}</span>
                              </>
                            )}
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
