import type { ReactNode } from 'react'

// En svag ton av förgrundsfärgen syns på alla bakgrunder (lektion, terminal, banner),
// så tangenter och kod ser likadana ut överallt.
const base = 'rounded bg-fg/10 font-mono text-fg'

/** En tangent. `chip` är den större varianten i "Keys in play". */
export function Kbd({ children, chip = false }: { children: ReactNode; chip?: boolean }) {
  return (
    <kbd className={`${base} ${chip ? 'min-w-7 px-1.5 py-0.5 text-center text-sm' : 'px-1 text-[0.9em]'}`}>
      {children}
    </kbd>
  )
}

/** Kod i löptext, t.ex. `nvim` eller ett kommando. */
export function Code({ children }: { children: ReactNode }) {
  return <code className={`${base} px-1 text-[0.9em]`}>{children}</code>
}
