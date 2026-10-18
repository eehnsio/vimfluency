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

const INSERT_COMMANDS = new Set(['i', 'a', 'I', 'A', 'o', 'O', 'S', 's', 'C'])
const OPERATORS = new Set(['c', 'd', 'y'])
const TAKES_CHAR = new Set(['f', 'F', 't', 'T'])
const PRETTY: Record<string, string> = {
  '<CR>': 'Enter',
  '<Esc>': 'Esc',
  '<BS>': 'Backspace',
  '<Tab>': 'Tab',
  '<Del>': 'Delete',
  '<Up>': '↑',
  '<Down>': '↓',
  '<Left>': '←',
  '<Right>': '→',
  '<Home>': 'Home',
  '<End>': 'End',
  ' ': 'Space',
}

/** En tangent i notationen från `parseKeys`/`keyFromEvent` som man skriver den: `<C-d>` → `Ctrl-d`. */
export function prettyKey(key: string): string {
  const ctrl = /^<C-(.)>$/.exec(key)
  return ctrl ? `Ctrl-${ctrl[1]}` : (PRETTY[key] ?? key)
}

/**
 * Lösningens kommandotangenter: det man skriver i insert-läge eller i en
 * `:`/`/`-prompt räknas inte, bara tangenterna som tar en dit och därifrån.
 * Annars stavar "Keys in play" ut svaret bokstav för bokstav.
 */
function commandKeys(tokens: string[]): string[] {
  const keys: string[] = []
  let mode: 'normal' | 'visual' | 'insert' | 'prompt' = 'normal'
  let operator: string | null = null
  let expect: 'object' | 'char' | null = null

  for (const token of tokens) {
    if (mode === 'insert' || mode === 'prompt') {
      if (token === '<Esc>' || (mode === 'prompt' && token === '<CR>')) {
        keys.push(token)
        mode = 'normal'
      }
      continue
    }
    keys.push(token)

    // Argumentet till ett textobjekt (`i(`) eller en sökning på rad (`t)`).
    if (expect) {
      expect = null
      if (operator === 'c') mode = 'insert'
      else if (operator) mode = 'normal'
      operator = null
      continue
    }
    if (token === ':' || token === '/' || token === '?') {
      mode = 'prompt'
      continue
    }
    if (TAKES_CHAR.has(token)) {
      expect = 'char'
      continue
    }
    if ((operator || mode === 'visual') && (token === 'i' || token === 'a')) {
      expect = 'object'
      continue
    }
    if (/^\d$/.test(token)) continue
    if (operator) {
      // En rörelse (`w`, `$`) eller samma operator igen (`cc`, `dd`).
      if (operator === 'c') mode = 'insert'
      operator = null
      continue
    }
    if (mode === 'visual') {
      if (token === 'c') mode = 'insert'
      else if (OPERATORS.has(token) || token === '<Esc>') mode = 'normal'
      continue
    }
    if (token === 'v' || token === 'V') mode = 'visual'
    else if (OPERATORS.has(token)) operator = token
    else if (INSERT_COMMANDS.has(token)) mode = 'insert'
  }
  return keys
}

/** `g` `g` blir `gg` och `d` `d` blir `dd`, som man tänker på dem. */
function joinDoubled(keys: string[]): string[] {
  const joined: string[] = []
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    if (/^[gcdy]$/.test(key) && keys[index + 1] === key) {
      joined.push(key + key)
      index++
    } else {
      joined.push(key)
    }
  }
  return joined
}

/**
 * Tangenterna man ser i UI:t: lösningens kommandotangenter plus extra. Alla
 * siffror visas som en enda `0-9`, eftersom låset tillåter vilket count som helst.
 */
export function displayKeys(solution: string, extra = ''): string[] {
  const keys = [...joinDoubled(commandKeys(parseKeys(solution))), ...parseKeys(extra)]
    .filter((key) => key !== ' ')
    .map((key) => (/^\d$/.test(key) ? '0-9' : prettyKey(key)))
  return [...new Set(keys)]
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
