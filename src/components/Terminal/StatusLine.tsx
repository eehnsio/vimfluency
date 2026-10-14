import type { EditorState } from '../../engine/checks'

interface Props {
  state: EditorState | null
  par?: number
}

export function StatusLine({ state, par }: Props) {
  const mode = state?.mode ?? 'normal'
  return (
    <div className="flex items-center gap-4 border-t border-border bg-surface-raised px-3 py-1 font-mono text-xs">
      <span className="rounded bg-accent px-2 font-semibold text-term-bg uppercase">{mode}</span>
      <span className="text-fg-muted">
        {state ? `${state.cursor.line}:${state.cursor.col}` : '–'}
      </span>
      <span className="ml-auto text-fg-muted">
        keys {state?.keystrokes ?? 0}
        {par !== undefined && ` / par ${par}`}
      </span>
    </div>
  )
}
