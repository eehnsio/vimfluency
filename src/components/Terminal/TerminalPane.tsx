import { useState, type ReactNode } from 'react'

interface Props {
  filename: string
  children: ReactNode
}

/**
 * Terminalen som ett eget fönster med titelrad. Startar maximerad. Den gröna
 * knappen växlar mellan maximerad och ett mindre, centrerat fönster.
 */
export function TerminalPane({ filename, children }: Props) {
  const [maximized, setMaximized] = useState(true)

  return (
    <section
      aria-label="Terminal"
      className={`flex h-full items-center justify-center bg-surface ${maximized ? 'p-0' : 'p-8'}`}
    >
      <div
        className={`flex flex-col overflow-hidden border-border bg-term-bg text-term-fg shadow-2xl ${
          maximized
            ? 'h-full w-full'
            : 'h-[min(34rem,100%)] w-full max-w-3xl rounded-xl border'
        }`}
      >
        <header className="flex items-center gap-2 border-b border-border bg-surface-raised px-3 py-2">
          <span className="flex gap-2">
            <span aria-hidden className="size-3 rounded-full bg-[#ff5f57]" />
            <span aria-hidden className="size-3 rounded-full bg-[#febc2e]" />
            <button
              type="button"
              aria-label={maximized ? 'Restore terminal size' : 'Maximize terminal'}
              aria-pressed={maximized}
              onClick={() => setMaximized((value) => !value)}
              className="size-3 rounded-full bg-[#28c840] hover:brightness-125"
            />
          </span>
          <span className="ml-3 font-mono text-xs text-fg-muted">~/vimfluency</span>
          <span className="ml-auto font-mono text-xs text-fg-muted">nvim {filename}</span>
        </header>
        {children}
      </div>
    </section>
  )
}
