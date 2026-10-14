interface Props {
  onNext?: () => void
  onReset: () => void
}

export function CompletionBanner({ onNext, onReset }: Props) {
  return (
    <div
      role="status"
      className="flex items-center gap-4 border-t border-success bg-surface-raised px-4 py-3 text-sm"
    >
      <span className="font-semibold text-success">Exercise complete</span>
      <span className="ml-auto flex gap-2">
        <button type="button" onClick={onReset} className="rounded-panel border border-border px-3 py-1 hover:bg-border">
          Try again <kbd className="ml-1 font-mono text-xs text-fg-muted">r</kbd>
        </button>
        {onNext && (
          <button type="button" onClick={onNext} className="rounded-panel bg-accent px-3 py-1 font-semibold text-term-bg">
            Next <kbd className="ml-1 font-mono text-xs">Enter</kbd>
          </button>
        )}
      </span>
    </div>
  )
}
