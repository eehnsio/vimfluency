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

  it('remembers that nvim was opened in the intro', () => {
    const first = renderHook(() => useProgress())
    expect(first.result.current.openedNvim).toBe(false)
    act(() => first.result.current.openNvim())
    expect(first.result.current.openedNvim).toBe(true)
    expect(renderHook(() => useProgress()).result.current.openedNvim).toBe(true)
  })

  it('remembers which exercises were completed with help', () => {
    const first = renderHook(() => useProgress())
    act(() => {
      first.result.current.markAssisted('a')
      first.result.current.markAssisted('a')
    })
    expect([...first.result.current.assisted]).toEqual(['a'])
    expect([...renderHook(() => useProgress()).result.current.assisted]).toEqual(['a'])
  })

  it('ignores corrupt storage', () => {
    localStorage.setItem('vimfluency:progress', '{nope')
    const { result } = renderHook(() => useProgress())
    expect(result.current.completed.size).toBe(0)
  })
})
