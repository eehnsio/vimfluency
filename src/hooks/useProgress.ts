import { useCallback, useState } from 'react'

const STORAGE_KEY = 'vimfluency:progress'

interface Stored {
  completed: string[]
  lastId?: string
  /** Användaren har skrivit `nvim` i introt och behöver inte göra det igen. */
  openedNvim?: boolean
  /** Övningar där lösningen visades. Klarade med hjälp. */
  assisted: string[]
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>
      return {
        completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id) => typeof id === 'string') : [],
        lastId: typeof parsed.lastId === 'string' ? parsed.lastId : undefined,
        openedNvim: parsed.openedNvim === true,
        assisted: Array.isArray(parsed.assisted) ? parsed.assisted.filter((id) => typeof id === 'string') : [],
      }
    }
  } catch {
    // Korrupt eller otillgänglig lagring: börja om.
  }
  return { completed: [], assisted: [] }
}

function save(stored: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Lagring kan vara blockerad. Framsteg gäller då bara under sessionen.
  }
}

export function useProgress() {
  const [stored, setStored] = useState<Stored>(load)

  const update = useCallback((change: (current: Stored) => Stored) => {
    setStored((current) => {
      const next = change(current)
      save(next)
      return next
    })
  }, [])

  const markCompleted = useCallback(
    (id: string) =>
      update((current) =>
        current.completed.includes(id) ? current : { ...current, completed: [...current.completed, id] },
      ),
    [update],
  )

  const select = useCallback((id: string) => update((current) => ({ ...current, lastId: id })), [update])

  const markAssisted = useCallback(
    (id: string) =>
      update((current) =>
        current.assisted.includes(id) ? current : { ...current, assisted: [...current.assisted, id] },
      ),
    [update],
  )

  const openNvim = useCallback(() => update((current) => ({ ...current, openedNvim: true })), [update])

  return {
    completed: new Set(stored.completed),
    lastId: stored.lastId,
    openedNvim: stored.openedNvim === true,
    assisted: new Set(stored.assisted),
    markAssisted,
    markCompleted,
    select,
    openNvim,
  }
}
