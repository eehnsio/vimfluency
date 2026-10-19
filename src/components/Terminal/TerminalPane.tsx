import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'

interface Props {
  /** Filen som är öppen i nvim. Utelämnas när terminalen bara visar skalet. */
  filename?: string
  children: ReactNode
}

// Ett musklick ska inte ta fokus från editorn. Med Tab går knapparna fortfarande att nå.
const keepFocus = (event: MouseEvent) => event.preventDefault()

const dot = 'size-3 rounded-full transition-[filter] duration-150 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Terminalen som ett eget fönster med titelrad. Startar maximerad, men aldrig
 * kant i kant. Den gröna
 * knappen växlar mellan maximerad och ett mindre, centrerat fönster, och den gula
 * gör det mindre. Den röda stänger inte: i vim avslutar man med `:q`.
 */
export function TerminalPane({ filename, children }: Props) {
  const [maximized, setMaximized] = useState(true)
  const [quitting, setQuitting] = useState(false)

  useEffect(() => {
    if (!quitting) return
    const timer = setTimeout(() => setQuitting(false), 3000)
    return () => clearTimeout(timer)
  }, [quitting])

  return (
    <section
      aria-label="Terminal"
      className={`flex h-full items-center justify-center bg-surface ${maximized ? 'p-3' : 'p-8'}`}
    >
      {/* Även maximerad har terminalen marginal, kant och rundade hörn, så att den
          läses som ett fönster och trafikljusen betyder något. */}
      <div
        className={`flex flex-col overflow-hidden rounded-xl border border-border bg-term-bg text-term-fg shadow-2xl ${
          maximized ? 'h-full w-full' : 'h-[min(34rem,100%)] w-full max-w-3xl'
        }`}
      >
        <header className="flex items-center gap-2 border-b border-border bg-surface-raised px-3 py-2">
          <span className="flex gap-2">
            <button
              type="button"
              onMouseDown={keepFocus}
              aria-label="Close terminal"
              onClick={() => setQuitting(true)}
              className={`${dot} bg-window-close`}
            />
            <button
              type="button"
              onMouseDown={keepFocus}
              aria-label="Make terminal smaller"
              disabled={!maximized}
              onClick={() => setMaximized(false)}
              className={`${dot} bg-window-minimize disabled:opacity-40 disabled:hover:brightness-100`}
            />
            <button
              type="button"
              onMouseDown={keepFocus}
              aria-label={maximized ? 'Restore terminal size' : 'Maximize terminal'}
              aria-pressed={maximized}
              onClick={() => setMaximized((value) => !value)}
              className={`${dot} bg-window-zoom`}
            />
          </span>
          {quitting ? (
            <span role="status" className="ml-3 font-mono text-xs text-warning">
              In Vim you quit with :q. Not yet, though.
            </span>
          ) : (
            <span className="ml-3 font-mono text-xs text-fg-muted">~/vimfluency</span>
          )}
          <span className="ml-auto font-mono text-xs text-fg-muted">
            {filename ? `nvim ${filename}` : 'zsh'}
          </span>
        </header>
        {children}
      </div>
    </section>
  )
}
