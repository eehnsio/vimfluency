import { evaluate } from '../engine/checks'
import { parseKeys } from '../engine/keys'
import { createExerciseSession } from '../engine/exerciseSession'
import type { Session } from '../engine/session'
import { activeContent } from './define'
import { allExercises, categories, getExercise, nextExercise } from './registry'

describe('registry', () => {
  it('has unique exercise ids', () => {
    const ids = allExercises.map((exercise) => exercise.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique category ids and no empty category', () => {
    expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length)
    for (const category of categories) expect(category.exercises.length).toBeGreaterThan(0)
  })

  it('looks up exercises and the next one in order', () => {
    const [first, second] = allExercises
    expect(getExercise(first.id)).toBe(first)
    expect(getExercise('nope')).toBeUndefined()
    expect(nextExercise(first.id)).toBe(second)
    expect(nextExercise(allExercises.at(-1)!.id)).toBeUndefined()
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

  // Sessionen byggs som i appen (låst, med TSX och tema), annars missar testerna
  // fel som bara uppstår med låset på.
  const open = (onBlocked?: (key: string) => void) => createExerciseSession(exercise, { onBlocked })
  const evaluateNow = (session: Session) =>
    evaluate(exercise.checks, session.getState(), activeContent(exercise))

  it('is not solved at the start', () => {
    const session = open()
    expect(evaluateNow(session).passed).toBe(false)
    session.destroy()
  })

  it('is solved by the reference solution', () => {
    const session = open()
    session.sendKeys(exercise.solution)
    expect(evaluateNow(session).failed).toEqual([])
    session.destroy()
  })

  it('is not solved after solving it and resetting', () => {
    const session = open()
    session.sendKeys(exercise.solution)
    session.reset()
    expect(evaluateNow(session).passed).toBe(false)
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
    session.view.contentDOM.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true, cancelable: true }))
    expect(blocked).toEqual(['r'])
    expect(session.view.state.doc.toString()).toBe(activeContent(exercise))
    expect(session.getState().cursor).toEqual(exercise.start)
    session.destroy()
  })
})

describe('prompt exercises with real key events', () => {
  // `sendKeys` skriver direkt i promptens inputfält. Här går tangenterna genom
  // det låsta `keydown`-flödet som i webbläsaren, med `keyCode` som pluginet läser.
  const KEY_CODES: Record<string, number> = { Enter: 13, Escape: 27 }
  const keydown = (target: Element, key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    Object.defineProperty(event, 'keyCode', { value: KEY_CODES[key] ?? key.toUpperCase().charCodeAt(0) })
    target.dispatchEvent(event)
  }
  const typeKey = (session: Session, key: string) => {
    const input = session.view.dom.querySelector('input')
    if (!input) return keydown(session.view.contentDOM, key)
    keydown(input, key)
    if (key.length === 1) {
      input.value += key
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  it.each([['search-next'], ['replace-current-line'], ['rename-variable']])(
    '%s is solved by typing its keys into the locked prompt',
    (id) => {
      const exercise = getExercise(id)!
      const session = createExerciseSession(exercise)
      const tokens = parseKeys(exercise.solution)
      for (const token of tokens) typeKey(session, token === '<CR>' ? 'Enter' : token)
      expect(evaluate(exercise.checks, session.getState(), activeContent(exercise)).failed).toEqual([])
      session.destroy()
    },
  )
})
