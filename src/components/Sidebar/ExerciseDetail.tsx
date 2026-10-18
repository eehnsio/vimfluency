import { useState } from 'react'
import { displayKeys } from '../../engine/lock'
import type { Exercise } from '../../exercises/types'

interface Props {
  exercise: Exercise
  onReset: () => void
  /** Anropas första gången lösningen visas, så att övningen kan markeras som klarad med hjälp. */
  onSolutionShown?: () => void
  /** Ger editorn fokus igen, så att man kan prova hinten direkt. */
  onFocusEditor?: () => void
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
function Hints({ exercise, onSolutionShown, onFocusEditor }: Pick<Props, 'exercise' | 'onSolutionShown' | 'onFocusEditor'>) {
  const hints = exercise.hints ?? []
  const [shown, setShown] = useState(0)
  const [solutionShown, setSolutionShown] = useState(false)

  const allHintsShown = shown >= hints.length
  const showSolution = () => {
    setSolutionShown(true)
    onSolutionShown?.()
    onFocusEditor?.()
  }
  const showNextHint = () => {
    setShown((count) => count + 1)
    onFocusEditor?.()
  }

  return (
    <section aria-label="Hints" className="flex flex-col gap-3 border-t border-border pt-5">
      {/* Fokus går till editorn när en hint visas, så den läses upp härifrån. Regionen finns från start. */}
      <div aria-live="polite" className="flex flex-col gap-3 empty:hidden">
        {shown > 0 && (
          <ol className="flex flex-col gap-2 text-sm leading-relaxed">
            {hints.slice(0, shown).map((hint, index) => (
              <li key={hint} className="flex gap-3">
                <span aria-hidden className="pt-px font-mono text-xs text-accent">
                  {index + 1}
                </span>
                <span>
                  <Inline text={hint} />
                </span>
              </li>
            ))}
          </ol>
        )}
        {solutionShown && (
          <p className="text-sm text-fg-muted">
            Keys: <code className="rounded bg-term-bg px-1.5 py-0.5 font-mono text-term-fg">{exercise.solution}</code>
          </p>
        )}
      </div>

      {!solutionShown && (
        <button
          type="button"
          onClick={allHintsShown ? showSolution : showNextHint}
          className={`-mx-2 self-start rounded-panel px-2 py-1 text-sm transition-colors duration-150 hover:bg-border focus-visible:outline-2 focus-visible:outline-accent ${
            allHintsShown ? 'text-fg-muted' : 'text-accent'
          }`}
        >
          {!allHintsShown
            ? `Show hint ${shown + 1} of ${hints.length}`
            : hints.length > 0
              ? 'Still stuck? Show the keys'
              : 'Show the keys'}
        </button>
      )}
    </section>
  )
}

export function ExerciseDetail({ exercise, onReset, onSolutionShown, onFocusEditor }: Props) {
  return (
    <article className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-balance">{exercise.title}</h2>
        <p className="text-[15px] leading-relaxed text-fg-muted">
          <Inline text={exercise.instructions} />
        </p>
      </header>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-fg-muted uppercase">Keys in play</h3>
        <p className="flex flex-wrap gap-1.5">
          {displayKeys(exercise.solution, exercise.allowedKeys).map((key) => (
            <kbd key={key} className="min-w-7 rounded border border-border bg-term-bg px-1.5 py-0.5 text-center font-mono text-sm text-term-fg">
              {key}
            </kbd>
          ))}
        </p>
      </div>
      <Hints key={exercise.id} exercise={exercise} onSolutionShown={onSolutionShown} onFocusEditor={onFocusEditor} />
      <div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-panel border border-border px-3 py-1 text-sm transition-colors duration-150 hover:bg-border focus-visible:outline-2 focus-visible:outline-accent"
        >
          Start over <kbd className="ml-1 font-mono text-xs text-fg-muted">r</kbd>
        </button>
      </div>
    </article>
  )
}
