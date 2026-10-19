import { Code } from '../Kbd'

/** Hur stort ögonblicket är: en övning, en hel kategori eller hela kursen. */
export type Milestone =
  | { kind: 'exercise' }
  | { kind: 'category'; title: string; upNext?: string }
  | { kind: 'course'; total: number }

interface Props {
  milestone?: Milestone
  onNext?: () => void
  /** "Next", eller "First unfinished" när det inte finns någon nästa övning. */
  nextLabel?: string
  onReset: () => void
}

const button = 'rounded-panel px-3 py-1 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent'

export function CompletionBanner({ milestone = { kind: 'exercise' }, onNext, nextLabel = 'Next', onReset }: Props) {
  const big = milestone.kind !== 'exercise'
  return (
    <div
      role="status"
      className={`flex items-center gap-3 border-t border-success px-4 py-3 text-sm transition-[opacity,transform] duration-200 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none ${
        big ? 'bg-success/10' : 'bg-surface-raised'
      }`}
    >
      <span
        aria-hidden
        className="grid size-5 shrink-0 place-items-center rounded-full bg-success text-xs font-bold text-term-bg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:scale-0 motion-reduce:transition-none"
      >
        ✓
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-semibold text-success">
          {milestone.kind === 'exercise' && 'Exercise complete'}
          {milestone.kind === 'category' && `${milestone.title} complete`}
          {milestone.kind === 'course' && 'Course complete'}
        </span>
        {milestone.kind === 'category' && milestone.upNext && (
          <span className="text-fg-muted">Up next: {milestone.upNext}</span>
        )}
        {milestone.kind === 'course' && (
          <span className="text-fg-muted">
            All {milestone.total} exercises done. You can finally quit Vim:{' '}
            <Code>:q</Code>
          </span>
        )}
      </span>
      <span className="ml-auto flex shrink-0 gap-2">
        <button type="button" onClick={onReset} className={`${button} border border-border hover:bg-border`}>
          Start over <kbd className="ml-1 font-mono text-xs text-fg-muted">r</kbd>
        </button>
        {onNext && (
          <button type="button" onClick={onNext} className={`${button} bg-accent font-semibold text-term-bg hover:brightness-110`}>
            {nextLabel} <kbd className="ml-1 font-mono text-xs">Enter</kbd>
          </button>
        )}
      </span>
    </div>
  )
}
