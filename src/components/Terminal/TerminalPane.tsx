import type { ReactNode } from 'react'

interface Props {
  filename: string
  children: ReactNode
}

export function TerminalPane({ filename, children }: Props) {
  return (
    <section aria-label="Terminal" className="flex h-full min-w-0 flex-col bg-term-bg text-term-fg">
      <header className="flex items-center gap-2 border-b border-border bg-surface-raised px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
        </span>
        <span className="ml-3 rounded-t bg-term-bg px-3 py-0.5 font-mono text-xs">{filename}</span>
      </header>
      {children}
    </section>
  )
}
