import { evaluate } from '../engine/checks'
import { lessonDisplayKeys, lessonKeys, unlockedKeys } from '../engine/curriculum'
import { parseKeys } from '../engine/keys'
import { commandKeys } from '../engine/lock'
import { createExerciseSession } from '../engine/exerciseSession'
import type { Session } from '../engine/session'
import { activeContent, goalOf } from './define'
import { allExercises, allLessons, categories, getExercise, lessonOf, nextExercise } from './registry'
import type { NumberOptions } from './types'

const PREFERENCES: [string, NumberOptions][] = [
  ['hybrid', { number: true, relativenumber: true }],
  ['absolute', { number: true, relativenumber: false }],
  ['relative', { number: false, relativenumber: true }],
]

// En riktig `keydown` med `keyCode`, som pluginets prompt läser.
const KEY_CODES: Record<string, number> = { Enter: 13, Escape: 27 }
const EVENT_KEYS: Record<string, string> = { '<CR>': 'Enter', '<Esc>': 'Escape', '<BS>': 'Backspace' }
function keydown(target: Element, key: string) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  Object.defineProperty(event, 'keyCode', { value: KEY_CODES[key] ?? key.toUpperCase().charCodeAt(0) })
  target.dispatchEvent(event)
  return event
}

/**
 * Skriver en lösning som användaren gör det, genom det låsta `keydown`-flödet:
 * kommandon i normal- och visualläge och i prompten som riktiga tangenttryck.
 * Text i insert-läge går via `sendKeys`, eftersom jsdom inte skriver tecken själv.
 */
function type(session: Session, notation: string) {
  for (const token of parseKeys(notation)) {
    const key = EVENT_KEYS[token] ?? token
    const input = session.view.dom.querySelector('input')
    if (input) {
      keydown(input, key)
      if (key.length === 1) {
        input.value += key
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    } else if (session.getState().mode === 'insert' && token !== '<Esc>') {
      session.sendKeys(token === '<' ? '<lt>' : token)
    } else {
      keydown(session.view.contentDOM, key)
    }
  }
}

/** En tangent i "Keys in play" som låset ser den: `0-9` → `0`, `gg` → två `g`. */
function asLockKeys(key: string): string[] {
  const named = ({ Enter: '<CR>', Esc: '<Esc>', '0-9': '0' } as Record<string, string>)[key]
  return named ? [named] : [...key]
}

/**
 * Tangenter som texten nämner med backticks: `k`, `gg`, `3dd`, `Esc`. Längre
 * tokens är kod eller text (`const`, `:set number`), och taggar som `<p>` är text.
 */
const SPELLED_OUT: Record<string, string> = { Esc: '<Esc>', Enter: '<CR>', Backspace: '<BS>', Tab: '<Tab>' }
function mentionedKeys(text: string): string[] {
  return [...text.matchAll(/`([^`]+)`/g)]
    .map(([, token]) => SPELLED_OUT[token] ?? token)
    .filter((token) => (token.startsWith('<') ? /^<[A-Z]/.test(token) : token.length <= 3 && /[A-Za-z0-9]/.test(token)))
    .flatMap((token) => commandKeys(parseKeys(token)))
}

describe('mentionedKeys', () => {
  it('finds short key mentions and leaves code, text and tags alone', () => {
    expect(mentionedKeys('Press `k`, then `gg` or `3dd`, then `Esc`.')).toEqual(['k', 'g', 'g', '3', 'd', 'd', '<Esc>'])
    expect(mentionedKeys('Delete the `<p>` lines in `const` with `:set number` and `World`.')).toEqual([])
    // Det man skriver efter `:` eller `/` räknas inte, bara tangenten dit.
    expect(mentionedKeys('Run `:s` on this line.')).toEqual([':'])
  })
})

describe('registry', () => {
  it('has unique exercise and lesson ids', () => {
    const exerciseIds = allExercises.map((exercise) => exercise.id)
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length)
    const lessonIds = allLessons.map((lesson) => lesson.id)
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
  })

  it('has unique category ids and no empty category or lesson', () => {
    expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length)
    for (const category of categories) expect(category.lessons.length).toBeGreaterThan(0)
    for (const lesson of allLessons) expect(lesson.exercises.length).toBeGreaterThan(0)
  })

  it('looks up exercises, the next one in order and the lesson they belong to', () => {
    const [first, second] = allExercises
    expect(getExercise(first.id)).toBe(first)
    expect(getExercise('nope')).toBeUndefined()
    expect(nextExercise(first.id)).toBe(second)
    expect(nextExercise(allExercises.at(-1)!.id)).toBeUndefined()
    expect(lessonOf(first)).toBe(allLessons[0])
  })
})

describe('curriculum', () => {
  it('unlocks more as the course goes on, never less', () => {
    let previous = new Set<string>()
    for (const exercise of allExercises) {
      const now = unlockedKeys(exercise)
      for (const key of previous) expect(now).toContain(key)
      previous = new Set(now)
    }
  })

  it('never teaches r, since r is the emergency exit', () => {
    for (const lesson of allLessons) expect(lessonKeys(lesson)).not.toContain('r')
  })
})

describe.each(allLessons.map((lesson) => [lesson.id, lesson] as const))('lesson %s', (_id, lesson) => {
  const unlocked = unlockedKeys(lesson.exercises[0])

  it('explains without repeating a goal', () => {
    for (const exercise of lesson.exercises) expect(lesson.instructions).not.toContain(goalOf(exercise))
  })

  it('only mentions keys that are unlocked in it', () => {
    const text = [lesson.instructions, ...lesson.exercises.flatMap((exercise) => exercise.hints ?? [])].join('\n')
    for (const key of mentionedKeys(text)) expect(unlocked).toContain(key)
  })

  it('only shows keys in play that the lock lets through', () => {
    for (const key of lessonDisplayKeys(lesson)) {
      for (const lockKey of asLockKeys(key)) expect(unlocked).toContain(lockKey)
    }
  })

  it('unlocks the same keys in every one of its exercises', () => {
    for (const exercise of lesson.exercises) {
      for (const key of lessonKeys(lesson)) expect(unlockedKeys(exercise)).toContain(key)
    }
  })
})

describe.each(allExercises.map((exercise) => [exercise.id, exercise] as const))('exercise %s', (_id, exercise) => {
  const lines = () => activeContent(exercise).split('\n')

  it('has valid data', () => {
    expect(exercise.files.length).toBeGreaterThan(0)
    expect(exercise.checks.length).toBeGreaterThan(0)
    const inside = (line: number, col: number) =>
      line >= 1 && line <= lines().length && col >= 1 && col <= Math.max(1, lines()[line - 1].length)
    expect(inside(exercise.start.line, exercise.start.col)).toBe(true)
    for (const check of exercise.checks) {
      if (check.type === 'cursorAt') expect(inside(check.line, check.col ?? 1)).toBe(true)
    }
  })

  it('states its goal on the first line', () => {
    expect(goalOf(exercise)).toBeTruthy()
  })

  // Sessionen byggs som i appen (låst, med TSX och tema), annars missar testerna
  // fel som bara uppstår med låset på.
  const open = (onBlocked?: (key: string) => void, numberOptions?: NumberOptions) =>
    createExerciseSession(exercise, { onBlocked, numberOptions })
  const evaluateNow = (session: Session) =>
    evaluate(exercise.checks, session.getState(), activeContent(exercise))

  // Användaren väljer radnummer i introt, så varje övning ska gå att lösa med alla val.
  describe.each(exercise.numbers ? [PREFERENCES[0]] : PREFERENCES)('with %s line numbers', (_name, numbers) => {
    it('is not solved at the start', () => {
      const session = open(undefined, numbers)
      expect(evaluateNow(session).passed).toBe(false)
      session.destroy()
    })

    it('is solved by the reference solution', () => {
      const session = open(undefined, numbers)
      session.sendKeys(exercise.solution)
      expect(evaluateNow(session).failed).toEqual([])
      session.destroy()
    })

    it('is not solved after solving it and resetting', () => {
      const session = open(undefined, numbers)
      session.sendKeys(exercise.solution)
      session.reset()
      expect(evaluateNow(session).passed).toBe(false)
      session.destroy()
    })
  })

  it('is solved by typing its keys through the lock, with nothing blocked', () => {
    const blocked: string[] = []
    const session = open((key) => blocked.push(key))
    type(session, exercise.solution)
    expect(blocked).toEqual([])
    expect(evaluateNow(session).failed).toEqual([])
    session.destroy()
  })

  it('does not let the text it types act as a command', () => {
    // Bokstäverna man skriver i insert-läge eller i en prompt (`World`, `NOTE`) är
    // inte upplåsta som kommandon. I normalläge ska de blockeras och inget hända.
    const unlocked = unlockedKeys(exercise)
    const textKeys = [...new Set(parseKeys(exercise.solution))].filter((key) => key.length === 1 && !unlocked.has(key))
    const blocked: string[] = []
    const session = open((key) => blocked.push(key))
    const before = session.getState()
    for (const key of textKeys) keydown(session.view.contentDOM, key)
    expect(blocked).toEqual(textKeys)
    expect(session.getState()).toEqual(before)
    session.destroy()
  })

  it('does not use r as a normal-mode command, since r is the emergency exit', () => {
    // Text i insert-läge och i prompter är okej. Se `createKeyLock`.
    const session = open()
    const rAsCommand: number[] = []
    parseKeys(exercise.solution).forEach((key, index) => {
      const inPrompt = session.view.dom.querySelector('input') !== null
      if (key === 'r' && !inPrompt && session.getState().mode !== 'insert') rAsCommand.push(index)
      session.sendKeys(key === '<' ? '<lt>' : key)
    })
    session.destroy()
    expect(rAsCommand).toEqual([])
  })

  it('can always be started over with r in normal mode', () => {
    const blocked: string[] = []
    const session = open((key) => {
      blocked.push(key)
      if (key === 'r') session.reset()
    })
    session.sendKeys(exercise.solution)
    keydown(session.view.contentDOM, 'r')
    expect(blocked).toEqual(['r'])
    expect(session.view.state.doc.toString()).toBe(activeContent(exercise))
    expect(session.getState().cursor).toEqual(exercise.start)
    session.destroy()
  })
})

describe('intro-modes', () => {
  it('teaches u, which undoes what was typed', () => {
    const exercise = getExercise('intro-modes')!
    const blocked: string[] = []
    const session = createExerciseSession(exercise, { onBlocked: (key) => blocked.push(key) })
    type(session, exercise.solution)
    expect(session.getState().content).not.toBe(activeContent(exercise))
    type(session, 'u')
    expect(blocked).toEqual([])
    expect(session.getState().content).toBe(activeContent(exercise))
    session.destroy()
  })
})

describe('intro-show-numbers', () => {
  it('also accepts relative numbers, typed through the lock', () => {
    const exercise = getExercise('intro-show-numbers')!
    const blocked: string[] = []
    const session = createExerciseSession(exercise, { onBlocked: (key) => blocked.push(key) })
    type(session, ':set relativenumber<CR>')
    expect(blocked).toEqual([])
    expect(session.getState().options).toEqual({ number: false, relativenumber: true })
    expect(evaluate(exercise.checks, session.getState(), activeContent(exercise)).failed).toEqual([])
    session.destroy()
  })
})
