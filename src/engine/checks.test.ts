import { evaluate, type EditorState } from './checks'

const state: EditorState = {
  content: 'hello',
  cursor: { line: 1, col: 3 },
  mode: 'normal',
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

  it('treats an empty list as passed', () => {
    expect(evaluate([], state, 'hello').passed).toBe(true)
  })
})
