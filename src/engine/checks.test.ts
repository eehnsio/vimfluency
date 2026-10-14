import { evaluate, onlyNeedsNormalMode, type SessionState } from './checks'

const state: SessionState = {
  content: 'hello',
  cursor: { line: 1, col: 3 },
  mode: 'normal',
  options: { number: true, relativenumber: true },
}

describe('evaluate', () => {
  it('passes when every check holds', () => {
    const result = evaluate(
      [
        { type: 'cursorAt', line: 1, col: 3 },
        { type: 'contentEquals', expected: 'hello' },
        { type: 'mode', mode: 'normal' },
        { type: 'contentUnchanged' },
      ],
      state,
      'hello',
    )
    expect(result).toEqual({ passed: true, failed: [] })
  })

  it('reports each failing check', () => {
    const wrongCursor = { type: 'cursorAt', line: 2, col: 1 } as const
    const result = evaluate([wrongCursor, { type: 'mode', mode: 'normal' }], state, 'hello')
    expect(result.passed).toBe(false)
    expect(result.failed).toEqual([wrongCursor])
  })

  it('checks vim options', () => {
    expect(evaluate([{ type: 'option', name: 'number', value: true }], state, 'hello').passed).toBe(true)
    expect(evaluate([{ type: 'option', name: 'number', value: false }], state, 'hello').passed).toBe(false)
  })

  it('treats an empty list as passed', () => {
    expect(evaluate([], state, 'hello').passed).toBe(true)
  })
})

describe('onlyNeedsNormalMode', () => {
  const checks = [
    { type: 'contentEquals', expected: 'hello' },
    { type: 'mode', mode: 'normal' },
  ] as const

  it('is true when the text is right but you are still in insert mode', () => {
    expect(onlyNeedsNormalMode([...checks], { ...state, mode: 'insert' }, 'start')).toBe(true)
  })

  it('is false when the text is wrong', () => {
    expect(onlyNeedsNormalMode([...checks], { ...state, content: 'nope', mode: 'insert' }, 'start')).toBe(false)
  })

  it('is false in normal mode and when there is no mode check', () => {
    expect(onlyNeedsNormalMode([...checks], state, 'start')).toBe(false)
    expect(onlyNeedsNormalMode([{ type: 'contentEquals', expected: 'hello' }], { ...state, mode: 'insert' }, 'start')).toBe(false)
  })
})
