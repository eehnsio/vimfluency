import { evaluate } from '../engine/checks'
import { parseKeys } from '../engine/keys'
import { createSession } from '../engine/session'
import { allExercises, categories, getExercise, nextExercise } from './registry'
import type { Exercise } from './types'

const activeContent = (exercise: Exercise) =>
  exercise.files.find((file) => file.path === exercise.activeFile)!.content

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
      if (check.type === 'cursorAt') expect(inside(check.line, check.col)).toBe(true)
    }
  })

  it('is not solved at the start', () => {
    const session = createSession({ content: activeContent(exercise), start: exercise.start })
    expect(evaluate(exercise.checks, session.getState()).passed).toBe(false)
    session.destroy()
  })

  it('is solved by the reference solution', () => {
    const session = createSession({ content: activeContent(exercise), start: exercise.start })
    session.sendKeys(exercise.solution)
    const result = evaluate(exercise.checks, session.getState())
    expect(result.failed).toEqual([])
    session.destroy()
  })

  it('does not exceed par', () => {
    if (exercise.par === undefined) return
    expect(parseKeys(exercise.solution).length).toBeLessThanOrEqual(exercise.par)
  })
})
