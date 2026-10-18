import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  onClose: () => void
  children: ReactNode
}

/**
 * Kurslistan som en låda från vänster, ovanpå lektionen. Esc eller klick utanför
 * stänger. Resten av sidan är `inert` medan lådan är öppen (sätts i App).
 */
export function CourseDrawer({ onClose, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    const current = panel?.querySelector<HTMLElement>('[aria-current="true"]')
    ;(current ?? panel?.querySelector<HTMLElement>('button'))?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-40 bg-term-bg/60 transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Course"
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          onClose()
        }}
        className="flex h-full w-80 flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] starting:-translate-x-full motion-reduce:transition-none"
      >
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <h2 className="text-sm font-semibold">Course</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close course"
            className="rounded-panel px-2 py-1 font-mono text-xs text-fg-muted transition-colors duration-150 hover:bg-border hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Esc
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
