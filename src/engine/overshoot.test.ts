import { createOvershootTracker, cursorTarget, overshotTarget } from './overshoot'

describe('overshotTarget', () => {
  const target = { line: 3, col: 10 }

  it('detects a jump past the target in either direction', () => {
    expect(overshotTarget({ line: 3, col: 20 }, { line: 3, col: 2 }, target)).toBe(true)
    expect(overshotTarget({ line: 3, col: 2 }, { line: 3, col: 20 }, target)).toBe(true)
    expect(overshotTarget({ line: 1, col: 1 }, { line: 5, col: 1 }, target)).toBe(true)
  })

  it('does not flag landing on or short of the target', () => {
    expect(overshotTarget({ line: 3, col: 2 }, { line: 3, col: 10 }, target)).toBe(false)
    expect(overshotTarget({ line: 3, col: 2 }, { line: 3, col: 8 }, target)).toBe(false)
    expect(overshotTarget({ line: 3, col: 12 }, { line: 3, col: 10 }, target)).toBe(false)
  })

  it('does not flag a move that did not change position', () => {
    expect(overshotTarget({ line: 3, col: 2 }, { line: 3, col: 2 }, target)).toBe(false)
  })

  it('treats a target without column as a whole line', () => {
    const lineTarget = { line: 9 }
    expect(overshotTarget({ line: 1, col: 1 }, { line: 12, col: 1 }, lineTarget)).toBe(true)
    expect(overshotTarget({ line: 1, col: 1 }, { line: 9, col: 4 }, lineTarget)).toBe(false)
    expect(overshotTarget({ line: 1, col: 1 }, { line: 8, col: 1 }, lineTarget)).toBe(false)
  })
})

describe('cursorTarget', () => {
  it('finds the cursorAt check', () => {
    expect(cursorTarget([{ type: 'contentUnchanged' }, { type: 'cursorAt', line: 2, col: 4 }])).toEqual({
      line: 2,
      col: 4,
    })
  })

  it('returns undefined without one', () => {
    expect(cursorTarget([{ type: 'mode', mode: 'normal' }])).toBeUndefined()
  })
})

describe('createOvershootTracker', () => {
  const target = { line: 1, col: 10 }

  it('reports a jump past the target relative to the previous position', () => {
    const track = createOvershootTracker(target, { line: 1, col: 1 })
    expect(track({ line: 1, col: 5 }, 'normal')).toBe(false)
    expect(track({ line: 1, col: 20 }, 'normal')).toBe(true)
  })

  it('only moves its reference point in normal mode', () => {
    const track = createOvershootTracker(target, { line: 1, col: 1 })
    expect(track({ line: 1, col: 20 }, 'insert')).toBe(false)
    // Referenspunkten är fortfarande kolumn 1, så hoppet till 20 räknas.
    expect(track({ line: 1, col: 20 }, 'normal')).toBe(true)
  })

  it('never reports without a target', () => {
    const track = createOvershootTracker(undefined, { line: 1, col: 1 })
    expect(track({ line: 5, col: 1 }, 'normal')).toBe(false)
  })
})
