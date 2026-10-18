import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Exercise } from '../../exercises/types'
import { ExerciseDetail } from './ExerciseDetail'

const exercise: Exercise = {
  id: 'demo',
  title: 'Demo',
  instructions: 'Use `w` to move.',
  hints: ['First hint', 'Second hint'],
  files: [{ path: 'a.ts', content: 'a' }],
  activeFile: 'a.ts',
  start: { line: 1, col: 1 },
  checks: [{ type: 'cursorAt', line: 1 }],
  solution: '4w',
}

describe('ExerciseDetail hints', () => {
  it('starts with no hints and reveals them one at a time', async () => {
    const user = userEvent.setup()
    render(<ExerciseDetail exercise={exercise} onReset={() => {}} />)
    expect(screen.queryByText('First hint')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    expect(screen.getByText('First hint')).toBeInTheDocument()
    expect(screen.queryByText('Second hint')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show hint 2 of 2' }))
    expect(screen.getByText('Second hint')).toBeInTheDocument()
  })

  it('offers the keys only after the last hint and reports it', async () => {
    const user = userEvent.setup()
    const onSolutionShown = vi.fn()
    render(<ExerciseDetail exercise={exercise} onReset={() => {}} onSolutionShown={onSolutionShown} />)
    expect(screen.queryByRole('button', { name: /Show the keys/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    await user.click(screen.getByRole('button', { name: 'Show hint 2 of 2' }))
    await user.click(screen.getByRole('button', { name: /Show the keys/ }))

    expect(screen.getByText('4w', { selector: 'code' })).toBeInTheDocument()
    expect(onSolutionShown).toHaveBeenCalledTimes(1)
  })

  it('goes straight to the keys when an exercise has no hints', () => {
    render(<ExerciseDetail exercise={{ ...exercise, hints: undefined }} onReset={() => {}} />)
    expect(screen.getByRole('button', { name: 'Show the keys' })).toBeInTheDocument()
  })

  it('forgets revealed hints when the exercise changes', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ExerciseDetail exercise={exercise} onReset={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    rerender(<ExerciseDetail exercise={{ ...exercise, id: 'other' }} onReset={() => {}} />)
    expect(screen.queryByText('First hint')).not.toBeInTheDocument()
  })
})

describe('ExerciseDetail focus', () => {
  it('gives the editor focus back after a hint and after showing the keys', async () => {
    const user = userEvent.setup()
    const onFocusEditor = vi.fn()
    render(<ExerciseDetail exercise={exercise} onReset={() => {}} onFocusEditor={onFocusEditor} />)
    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    expect(onFocusEditor).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Show hint 2 of 2' }))
    await user.click(screen.getByRole('button', { name: /Show the keys/ }))
    expect(onFocusEditor).toHaveBeenCalledTimes(3)
  })

  it('announces revealed hints in a live region that exists from the start', async () => {
    const user = userEvent.setup()
    render(<ExerciseDetail exercise={exercise} onReset={() => {}} />)
    const region = screen.getByRole('region', { name: 'Hints' }).querySelector('[aria-live="polite"]')!
    expect(region).toBeEmptyDOMElement()
    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    expect(region).toHaveTextContent('First hint')
  })
})
