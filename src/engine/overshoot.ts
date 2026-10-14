import type { Check, Mode } from '../exercises/types'

interface Position {
  line: number
  col: number
}

type Target = { line: number; col?: number }

/** Målet för en markörövning, eller `undefined` om övningen inte har ett. */
export function cursorTarget(checks: Check[]): Target | undefined {
  const check = checks.find((c) => c.type === 'cursorAt')
  return check && check.type === 'cursorAt' ? { line: check.line, col: check.col } : undefined
}

const compare = (a: Position, b: Position) => a.line - b.line || a.col - b.col

/**
 * Sant om markören hoppade över målet: målet ligger strikt mellan den gamla och
 * den nya positionen i dokumentordning. Ett mål utan kolumn gäller hela raden.
 */
export function overshotTarget(from: Position, to: Position, target: Target): boolean {
  if (compare(from, to) === 0) return false
  const [first, last] = compare(from, to) < 0 ? [from, to] : [to, from]

  if (target.col === undefined) {
    return first.line < target.line && target.line < last.line
  }
  const point = { line: target.line, col: target.col }
  return compare(first, point) < 0 && compare(point, last) < 0
}

/**
 * Minns var markören var senast och säger om nästa förflyttning hoppade förbi
 * målet. Bara normalt läge räknas, så en visuell markering eller text man
 * skriver in flyttar inte referenspunkten. Utan mål är svaret alltid `false`.
 */
export function createOvershootTracker(target: Target | undefined, initial: Position) {
  let previous = initial
  return (next: Position, mode: Mode): boolean => {
    if (!target || mode !== 'normal') return false
    const overshot = overshotTarget(previous, next, target)
    previous = next
    return overshot
  }
}
