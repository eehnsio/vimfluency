import type { Category } from '../../exercises/types'

interface Props {
  categories: Category[]
  selectedId: string
  completedIds: Set<string>
  /** Klarade där lösningen visades. */
  assistedIds?: Set<string>
  onSelect: (id: string) => void
}

export function ExerciseList({ categories, selectedId, completedIds, assistedIds, onSelect }: Props) {
  return (
    <nav aria-label="Exercises" className="flex flex-col gap-4 p-4">
      {categories.map((category) => (
        <section key={category.id}>
          <h2 className="text-xs font-semibold tracking-wide text-fg-muted uppercase">{category.title}</h2>
          <ul className="mt-1 flex flex-col">
            {category.exercises.map((exercise) => {
              const done = completedIds.has(exercise.id)
              const assisted = done && assistedIds?.has(exercise.id)
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
                    <span aria-hidden className={assisted ? 'text-fg-muted' : done ? 'text-success' : 'text-transparent'}>
                      ✓
                    </span>
                    <span>
                      {exercise.title}
                      {done && (
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
        </section>
      ))}
    </nav>
  )
}
