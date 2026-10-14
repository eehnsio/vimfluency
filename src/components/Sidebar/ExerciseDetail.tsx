import { displayKeys } from '../../engine/lock'
import type { Exercise } from '../../exercises/types'

interface Props {
  exercise: Exercise
  onReset: () => void
}

/** Renderar `kod` i löptext som <code>. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, index) =>
        part.startsWith('`') ? (
          <code key={index} className="rounded bg-term-bg px-1 font-mono text-[0.9em] text-term-fg">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function ExerciseDetail({ exercise, onReset }: Props) {
  return (
    <article className="flex flex-col gap-3 border-t border-border p-4">
      <h2 className="text-lg font-semibold">{exercise.title}</h2>
      <p className="text-sm leading-relaxed text-fg-muted">
        <Inline text={exercise.instructions} />
      </p>
      <p className="text-xs text-fg-muted">
        Keys in play:{' '}
        {displayKeys(exercise.solution, exercise.allowedKeys).map((key) => (
          <code key={key} className="mr-1 rounded bg-term-bg px-1 font-mono text-term-fg">
            {key}
          </code>
        ))}
        All other keys and the mouse are locked.
      </p>
      {exercise.hints && exercise.hints.length > 0 && (
        <details className="text-sm text-fg-muted">
          <summary className="cursor-pointer text-accent">Hints</summary>
          <ul className="mt-2 list-disc pl-5">
            {exercise.hints.map((hint) => (
              <li key={hint}>
                <Inline text={hint} />
              </li>
            ))}
          </ul>
        </details>
      )}
      <div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-panel border border-border px-3 py-1 text-sm hover:bg-border"
        >
          Reset
        </button>
      </div>
    </article>
  )
}
