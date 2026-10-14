import { act, renderHook } from '@testing-library/react'
import { useProgress } from './useProgress'

beforeEach(() => localStorage.clear())

describe('useProgress', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.completed.size).toBe(0)
    expect(result.current.lastId).toBeUndefined()
  })

  it('persists completed exercises and the last selection', () => {
    const first = renderHook(() => useProgress())
    act(() => {
      first.result.current.markCompleted('a')
      first.result.current.markCompleted('a')
      first.result.current.select('b')
    })
    expect([...first.result.current.completed]).toEqual(['a'])

    const second = renderHook(() => useProgress())
    expect([...second.result.current.completed]).toEqual(['a'])
    expect(second.result.current.lastId).toBe('b')
  })

  it('ignores corrupt storage', () => {
    localStorage.setItem('vimfluency:progress', '{nope')
    const { result } = renderHook(() => useProgress())
    expect(result.current.completed.size).toBe(0)
  })
})
