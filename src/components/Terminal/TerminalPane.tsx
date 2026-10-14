import type { ReactNode } from 'react'

interface Props {
  filename: string
  children: ReactNode
}

/** Terminalen som ett eget fönster, som ett riktigt terminalfönster med titelrad. */
export function TerminalPane({ filename, children }: Props) {
  return (
    <section aria-label="Terminal" className="flex h-full items-center justify-center bg-surface p-8">
      <div className="flex h-[min(34rem,100%)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-term-bg text-term-fg shadow-2xl">
        <header className="flex items-center gap-2 border-b border-border bg-surface-raised px-3 py-2">
          <span className="flex gap-2" aria-hidden>
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-3 font-mono text-xs text-fg-muted">~/vimfluency</span>
          <span className="ml-auto font-mono text-xs text-fg-muted">nvim {filename}</span>
        </header>
        {children}
      </div>
    </section>
  )
}
