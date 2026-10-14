interface Props {
  keystrokes: number
  par?: number
  onNext?: () => void
  onReset: () => void
}

export function CompletionBanner({ keystrokes, par, onNext, onReset }: Props) {
  const optimal = par !== undefined && keystrokes <= par
  return (
    <div
      role="status"
      className="flex items-center gap-4 border-t border-success bg-surface-raised px-4 py-3 text-sm"
    >
      <span className="font-semibold text-success">Exercise complete</span>
      <span className="text-fg-muted">
        {keystrokes} keystrokes{par !== undefined && ` (par ${par}${optimal ? ', optimal' : ''})`}
      </span>
      <span className="ml-auto flex gap-2">
        <button type="button" onClick={onReset} className="rounded-panel border border-border px-3 py-1 hover:bg-border">
          Try again
        </button>
        {onNext && (
          <button type="button" onClick={onNext} className="rounded-panel bg-accent px-3 py-1 font-semibold text-term-bg">
            Next
          </button>
        )}
      </span>
    </div>
  )
}
