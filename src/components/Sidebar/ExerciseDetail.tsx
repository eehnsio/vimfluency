import { useState } from 'react'
import { Code, Kbd } from '../Kbd'
import type { Exercise, Lesson } from '../../exercises/types'

interface Props {
  lesson: Lesson
  exercise: Exercise
  /** Övningens plats i lektionen: den första är den guidade, resten praktik. */
  step: { index: number; total: number }
  /** Lektionens tangenter, som "Keys in play" visar dem. */
  keys: string[]
  /** Det finns tidigare lektioner, vars tangenter också fungerar. */
  hasEarlier: boolean
  onReset: () => void
  /** Anropas första gången lösningen visas, så att övningen kan markeras som klarad med hjälp. */
  onSolutionShown?: () => void
  /** Ger editorn fokus igen, så att man kan prova hinten direkt. */
  onFocusEditor?: () => void
  /** Spelar upp lösningen i editorn. Bara den guidade övningen har den. */
  onWatch?: () => void
  watching?: boolean
}

/** Renderar `kod` i löptext som <code>. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, index) =>
        part.startsWith('`') ? (
          <Code key={index}>{part.slice(1, -1)}</Code>
        ) : (
          part
        ),
      )}
    </>
  )
}

const button =
  'rounded-panel px-2 py-1 text-sm transition-colors duration-150 hover:bg-border focus-visible:outline-2 focus-visible:outline-accent'

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
            Keys: <Code>{exercise.solution}</Code>
          </p>
        )}
      </div>

      {!solutionShown && (
        <button
          type="button"
          onClick={allHintsShown ? showSolution : showNextHint}
          className={`-mx-2 self-start ${button} ${allHintsShown ? 'text-fg-muted' : 'text-accent'}`}
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

/** "Try it" för den guidade övningen, "Practice 1 of 2" för resten. */
function stepLabel({ index, total }: Props['step']) {
  return index === 0 ? 'Try it' : `Practice ${index} of ${total - 1}`
}

export function ExerciseDetail({
  lesson,
  exercise,
  step,
  keys,
  hasEarlier,
  onReset,
  onSolutionShown,
  onFocusEditor,
  onWatch,
  watching = false,
}: Props) {
  return (
    <article className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">{stepLabel(step)}</p>
        <h2 className="text-xl font-semibold text-balance">{lesson.title}</h2>
        <p className="text-[15px] leading-relaxed text-fg-muted">
          <Inline text={lesson.instructions} />
        </p>
        {onWatch && (
          <button
            type="button"
            onClick={onWatch}
            disabled={watching}
            className={`-mx-2 self-start text-accent disabled:text-fg-muted ${button}`}
          >
            {watching ? 'Watching…' : '▶ Watch it'}
          </button>
        )}
      </header>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-fg-muted uppercase">Keys in play</h3>
        <p className="flex flex-wrap gap-1.5">
          {keys.map((key) => (
            <Kbd key={key} chip>
              {key}
            </Kbd>
          ))}
        </p>
        {hasEarlier && <p className="text-xs text-fg-muted">Everything from earlier lessons works too.</p>}
      </div>
      <Hints key={exercise.id} exercise={exercise} onSolutionShown={onSolutionShown} onFocusEditor={onFocusEditor} />
      <div>
        <button type="button" onClick={onReset} className={`border border-border px-3 ${button}`}>
          Start over <kbd className="ml-1 font-mono text-xs text-fg-muted">r</kbd>
        </button>
      </div>
    </article>
  )
}
