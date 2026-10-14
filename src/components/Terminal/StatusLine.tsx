import type { EditorState } from '../../engine/checks'

interface Props {
  state: EditorState | null
  blockedKey?: string | null
}

const MODE_COLOR = {
  normal: 'bg-accent',
  insert: 'bg-success',
  visual: 'bg-fg',
} as const

export function StatusLine({ state, blockedKey }: Props) {
  const mode = state?.mode ?? 'normal'
  return (
    <div className="flex items-center gap-4 border-t border-border bg-surface-raised px-3 py-1 font-mono text-xs">
      <span className={`rounded px-2 font-semibold text-term-bg uppercase ${MODE_COLOR[mode]}`}>{mode}</span>
      <span className="text-fg-muted">
        {state ? `${state.cursor.line}:${state.cursor.col}` : '–'}
      </span>
      {blockedKey && (
        <span role="alert" className="ml-auto text-fg-muted">
          <code className="rounded bg-term-bg px-1 text-fg">{blockedKey}</code> is locked in this exercise
        </span>
      )}
    </div>
  )
}
