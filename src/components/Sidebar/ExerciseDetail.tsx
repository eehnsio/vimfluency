import { useState } from 'react'
import { displayKeys } from '../../engine/lock'
import type { Exercise } from '../../exercises/types'

interface Props {
  exercise: Exercise
  onReset: () => void
  /** Anropas första gången lösningen visas, så att övningen kan markeras som klarad med hjälp. */
  onSolutionShown?: () => void
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

/**
 * Hintar visas en i taget. När alla hintar är visade kan man som sista utväg
 * visa tangenterna. Komponenten ska ha `key={exercise.id}` så att tillståndet
 * nollställs när övningen byts.
 */
function Hints({ exercise, onSolutionShown }: Pick<Props, 'exercise' | 'onSolutionShown'>) {
  const hints = exercise.hints ?? []
  const [shown, setShown] = useState(0)
  const [solutionShown, setSolutionShown] = useState(false)

  const allHintsShown = shown >= hints.length
  const showSolution = () => {
    setSolutionShown(true)
    onSolutionShown?.()
  }

  return (
    <section aria-label="Hints" className="rounded-panel border border-border bg-surface p-3 text-sm">
      <h3 className="text-xs font-semibold tracking-wide text-accent uppercase">Hints</h3>

      {shown > 0 && (
        <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-fg-muted">
          {hints.slice(0, shown).map((hint) => (
            <li key={hint}>
              <Inline text={hint} />
            </li>
          ))}
        </ol>
      )}

      {solutionShown && (
        <p className="mt-2 text-fg-muted">
          Keys: <code className="rounded bg-term-bg px-1.5 py-0.5 font-mono text-term-fg">{exercise.solution}</code>
        </p>
      )}

      {!solutionShown && (
        <div className="mt-2 flex flex-wrap gap-2">
          {!allHintsShown && (
            <button
              type="button"
              onClick={() => setShown((count) => count + 1)}
              className="rounded-panel border border-border px-3 py-1 hover:bg-border"
            >
              Show hint {shown + 1} of {hints.length}
            </button>
          )}
          {allHintsShown && (
            <button
              type="button"
              onClick={showSolution}
              className="rounded-panel border border-border px-3 py-1 text-fg-muted hover:bg-border"
            >
              {hints.length > 0 ? 'Still stuck? Show the keys' : 'Show the keys'}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export function ExerciseDetail({ exercise, onReset, onSolutionShown }: Props) {
  return (
    <article className="flex flex-col gap-3 border-b border-border p-4">
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
      <Hints key={exercise.id} exercise={exercise} onSolutionShown={onSolutionShown} />
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
