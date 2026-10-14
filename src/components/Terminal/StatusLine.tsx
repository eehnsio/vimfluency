import type { EditorState } from '../../engine/checks'

interface Props {
  state: EditorState | null
  filename: string
  blockedKey?: string | null
  /** Texten är rätt, men man måste gå tillbaka till normalt läge. */
  needsEsc?: boolean
  /** Markören hoppade förbi målet. */
  overshot?: boolean
}

const MODE_COLOR = {
  normal: 'bg-accent',
  insert: 'bg-success',
  visual: 'bg-fg',
} as const

const FILETYPES: Record<string, string> = {
  tsx: 'typescriptreact',
  ts: 'typescript',
  jsx: 'javascriptreact',
  js: 'javascript',
}

function filetype(filename: string) {
  return FILETYPES[filename.split('.').pop() ?? ''] ?? 'text'
}

function scrollPercent(state: EditorState) {
  const lines = state.content.split('\n').length
  if (state.cursor.line <= 1) return 'Top'
  if (state.cursor.line >= lines) return 'Bot'
  return `${Math.round((state.cursor.line / lines) * 100)}%`
}

/** Statusraden som i nvim, följd av kommandoraden där meddelanden visas. */
export function StatusLine({ state, filename, blockedKey, overshot, needsEsc }: Props) {
  const mode = state?.mode ?? 'normal'
  return (
    <div className="font-mono text-sm">
      <div className="flex items-stretch bg-surface-raised">
        <span className={`px-3 py-1.5 font-bold text-term-bg uppercase ${MODE_COLOR[mode]}`}>{mode}</span>
        <span className="px-3 py-1.5">{filename}</span>
        <span className="ml-auto px-3 py-1.5 text-fg-muted">{filetype(filename)}</span>
        <span className="px-3 py-1.5 text-fg-muted">{state ? scrollPercent(state) : ''}</span>
        <span className={`px-3 py-1.5 font-bold text-term-bg ${MODE_COLOR[mode]}`}>
          {state ? `${state.cursor.line}:${state.cursor.col}` : '–'}
        </span>
      </div>
      <div className="h-7 px-3 py-1 text-xs text-fg-muted">
        {needsEsc && (
          <span role="status" className="text-success">
            That looks right. Press{' '}
            <code className="rounded bg-surface-raised px-1 text-fg">Esc</code> to go back to normal mode.
          </span>
        )}
        {!needsEsc && overshot && !blockedKey && (
          <span role="alert" className="text-danger">
            You went past the target. Press{' '}
            <code className="rounded bg-surface-raised px-1 text-fg">r</code> to start over.
          </span>
        )}
        {!needsEsc && blockedKey && (
          <span role="alert">
            <code className="rounded bg-surface-raised px-1 text-fg">{blockedKey}</code> is locked in this
            exercise. Stuck? Press <code className="rounded bg-surface-raised px-1 text-fg">r</code> to start
            over.
          </span>
        )}
      </div>
    </div>
  )
}
