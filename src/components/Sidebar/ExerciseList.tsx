import { useState } from 'react'
import type { Category } from '../../exercises/types'

interface Props {
  categories: Category[]
  selectedId: string
  completedIds: Set<string>
  /** Klarade där lösningen visades. */
  assistedIds?: Set<string>
  onSelect: (id: string) => void
}

/**
 * En klar kategori är hopfälld som standard, men den som innehåller den valda
 * övningen är alltid öppen. Användaren kan öppna och stänga vilken som helst, och
 * valet gäller tills sidan laddas om.
 */
export function ExerciseList({ categories, selectedId, completedIds, assistedIds, onSelect }: Props) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({})

  return (
    <nav aria-label="Exercises" className="flex flex-col gap-4 p-4">
      {categories.map((category) => {
        const done = category.exercises.every((exercise) => completedIds.has(exercise.id))
        const holdsSelected = category.exercises.some((exercise) => exercise.id === selectedId)
        const open = toggled[category.id] ?? !(done && !holdsSelected)
        const listId = `category-${category.id}`

        return (
          <section key={category.id}>
            <h2 className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setToggled((current) => ({ ...current, [category.id]: !open }))}
                className="flex w-full items-center gap-2 rounded-panel text-left uppercase hover:text-fg"
              >
                <span aria-hidden className="w-3 text-[0.65rem]">
                  {open ? '▾' : '▸'}
                </span>
                {category.title}
                {done && (
                  <span aria-hidden className="ml-auto text-success">
                    ✓
                  </span>
                )}
              </button>
            </h2>
            {open && (
              <ul id={listId} className="mt-1 flex flex-col">
                {category.exercises.map((exercise) => {
                  const completed = completedIds.has(exercise.id)
                  const assisted = completed && assistedIds?.has(exercise.id)
                  const selected = exercise.id === selectedId
                  return (
                    <li key={exercise.id}>
                      <button
                        type="button"
                        aria-current={selected ? 'true' : undefined}
                        onClick={() => onSelect(exercise.id)}
                        className={`flex w-full items-center gap-2 rounded-panel px-2 py-1.5 text-left text-sm hover:bg-border ${
                          selected ? 'bg-border text-fg' : 'text-fg-muted'
                        }`}
                      >
                        <span
                          aria-hidden
                          className={assisted ? 'text-fg-muted' : completed ? 'text-success' : 'text-transparent'}
                        >
                          ✓
                        </span>
                        <span>
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
    </nav>
  )
}
