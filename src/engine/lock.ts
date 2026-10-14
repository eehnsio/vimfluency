import { parseKeys } from './keys'

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'AltGraph'])

const NAMED_KEYS: Record<string, string> = {
  Escape: '<Esc>',
  Enter: '<CR>',
  Backspace: '<BS>',
  Tab: '<Tab>',
  Delete: '<Del>',
  ArrowUp: '<Up>',
  ArrowDown: '<Down>',
  ArrowLeft: '<Left>',
  ArrowRight: '<Right>',
  Home: '<Home>',
  End: '<End>',
}

/**
 * Vilka tangenter som är påslagna i en övning: tangenterna i lösningen plus
 * eventuella extra (t.ex. `u` för undo). Är en siffra med får alla siffror
 * användas som count. `<Esc>` är alltid påslagen så att man kan ta sig ur ett läge.
 */
export function deriveAllowedKeys(solution: string, extra = ''): Set<string> {
  const tokens = [...parseKeys(solution), ...parseKeys(extra)]
  const allowed = new Set(tokens)
  allowed.add('<Esc>')
  if (tokens.some((token) => /^\d$/.test(token))) {
    for (let digit = 0; digit <= 9; digit++) allowed.add(String(digit))
  }
  return allowed
}

/** Tangenterna man ser i UI:t, utan count-expansionen. */
export function displayKeys(solution: string, extra = ''): string[] {
  return [...new Set([...parseKeys(solution), ...parseKeys(extra)])].filter((key) => key !== ' ')
}

/** Sant för tangenter som bara är modifierare och inte skriver eller gör något själva. */
export const isModifierKey = (event: KeyboardEvent) => MODIFIER_KEYS.has(event.key)

/**
 * Översätter ett tangentbordsevent till samma notation som `parseKeys`, eller
 * `null` om eventet inte är en editortangent (modifierare, webbläsargenvägar).
 */
export function keyFromEvent(event: KeyboardEvent): string | null {
  if (event.metaKey || isModifierKey(event)) return null
  if (event.key in NAMED_KEYS) return NAMED_KEYS[event.key]
  if (event.ctrlKey && event.key.length === 1) return `<C-${event.key.toLowerCase()}>`
  return event.key
}
