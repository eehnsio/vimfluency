import type { RefObject } from 'react'

export function VimEditor({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  return <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden" />
}
