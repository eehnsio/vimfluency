import type { SessionState } from '../../engine/checks'
import { prettyKey } from '../../engine/lock'
import { Kbd } from '../Kbd'

interface Props {
  state: SessionState | null
  filename: string
  blockedKey?: string | null
  /** Den låsta tangenten är versalen av en upplåst: troligen Caps Lock. */
  capsLock?: boolean
  /** Lektionens tangenter ("Keys in play"), för låst-meddelandet. */
  keysInPlay?: string[]
  /** Texten är rätt, men man måste gå tillbaka till normalt läge. */
  needsEsc?: boolean
  /** Markören hoppade förbi målet. */
  overshot?: boolean
  /** Fokus är utanför editorn, så tangenterna når den inte. */
  unfocused?: boolean
  /** Tangenterna "Watch it" har spelat upp hittills. `null` när ingen demo spelas. */
  demo?: string[] | null
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

function scrollPercent(state: SessionState) {
  const lines = state.content.split('\n').length
  if (state.cursor.line <= 1) return 'Top'
  if (state.cursor.line >= lines) return 'Bot'
  return `${Math.round((state.cursor.line / lines) * 100)}%`
}

/** Statusraden som i nvim, följd av kommandoraden där meddelanden visas. */
export function StatusLine({
  state,
  filename,
  blockedKey,
  capsLock,
  keysInPlay = [],
  overshot,
  needsEsc,
  unfocused,
  demo = null,
}: Props) {
  const mode = state?.mode ?? 'normal'
  // Ett meddelande i taget. En demo visar sina tangenter. Utan fokus når inga
  // tangenter editorn, så det går före Esc-uppmaningen, låst tangent och överskjutet mål.
  const message = demo
    ? 'demo'
    : unfocused
      ? 'unfocused'
      : needsEsc
        ? 'needsEsc'
        : blockedKey
          ? 'blocked'
          : overshot
            ? 'overshot'
            : null
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
      <div className="h-8 px-3 py-1.5 text-sm text-fg-muted">
        {message === 'demo' && (
          <span role="status" className="text-accent">
            Watch:{' '}
            {demo!.map((key, index) => (
              <span key={index}>
                <Kbd>{prettyKey(key)}</Kbd>{' '}
              </span>
            ))}
          </span>
        )}
        {message === 'unfocused' && (
          <span role="status">
            The editor is not focused. Click it or press <Kbd>Esc</Kbd> to keep going.
          </span>
        )}
        {message === 'needsEsc' && (
          <span role="status" className="text-success">
            That looks right. Press <Kbd>Esc</Kbd> to go back to normal mode.
          </span>
        )}
        {message === 'blocked' && (
          <span role="alert" className="text-warning">
            <Kbd>{prettyKey(blockedKey!)}</Kbd> is locked here.{capsLock && ' Caps Lock on?'} Use{' '}
            {keysInPlay.map((key) => (
              <span key={key}>
                <Kbd>{key}</Kbd>{' '}
              </span>
            ))}
            or <Kbd>r</Kbd> to start over.
          </span>
        )}
        {message === 'overshot' && (
          <span role="alert" className="text-danger">
            You went past the target. Move back, or press <Kbd>r</Kbd> to start over.
          </span>
        )}
      </div>
    </div>
  )
}
