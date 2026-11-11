import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Exercise, Lesson } from '../../exercises/types'
import { ExerciseDetail } from './ExerciseDetail'

const exercise: Exercise = {
  id: 'demo',
  hints: ['First hint', 'Second hint'],
  files: [{ path: 'a.ts', content: 'a' }],
  activeFile: 'a.ts',
  start: { line: 1, col: 1 },
  checks: [{ type: 'cursorAt', line: 1 }],
  solution: '4w',
}
const practice: Exercise = { ...exercise, id: 'demo-2', hints: undefined }
const lesson: Lesson = { id: 'demo', title: 'Demo: w', instructions: 'Use `w` to move.', exercises: [exercise, practice] }

type Props = Parameters<typeof ExerciseDetail>[0]
const renderDetail = (overrides: Partial<Props> = {}) => {
  const props: Props = {
    lesson,
    exercise,
    step: { index: 0, total: 2 },
    keys: ['0-9', 'w'],
    hasEarlier: true,
    onReset: () => {},
    ...overrides,
  }
  return render(<ExerciseDetail {...props} />)
}

describe('ExerciseDetail lesson', () => {
  it('shows the lesson, its keys and which step this is', () => {
    renderDetail()
    expect(screen.getByRole('heading', { level: 2, name: 'Demo: w' })).toBeInTheDocument()
    expect(screen.getByText('Try it')).toBeInTheDocument()
    expect(screen.getByText('w', { selector: 'code' })).toBeInTheDocument()
    expect(screen.getAllByText(/^(0-9|w)$/, { selector: 'kbd' })).toHaveLength(2)
    expect(screen.getByText('Everything from earlier lessons works too.')).toBeInTheDocument()
  })

  it('labels practice exercises and leaves out the earlier-lessons note in the first lesson', () => {
    renderDetail({ exercise: practice, step: { index: 1, total: 2 }, hasEarlier: false })
    expect(screen.getByText('Practice 1 of 1')).toBeInTheDocument()
    expect(screen.queryByText(/earlier lessons/)).not.toBeInTheDocument()
  })

  it('offers Watch it only when given, and disables it while watching', async () => {
    const onWatch = vi.fn()
    const { rerender } = renderDetail({ onWatch })
    await userEvent.click(screen.getByRole('button', { name: /Watch it/ }))
    expect(onWatch).toHaveBeenCalledTimes(1)

    rerender(<ExerciseDetail lesson={lesson} exercise={exercise} step={{ index: 0, total: 2 }} keys={[]} hasEarlier onReset={() => {}} onWatch={onWatch} watching />)
    expect(screen.getByRole('button', { name: 'Watching…' })).toBeDisabled()

    rerender(<ExerciseDetail lesson={lesson} exercise={practice} step={{ index: 1, total: 2 }} keys={[]} hasEarlier onReset={() => {}} />)
    expect(screen.queryByRole('button', { name: /Watch/ })).not.toBeInTheDocument()
  })
})

describe('ExerciseDetail hints', () => {
  it('starts with no hints and reveals them one at a time', async () => {
    const user = userEvent.setup()
    renderDetail()
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
    renderDetail({ onSolutionShown })
    expect(screen.queryByRole('button', { name: /Show the keys/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    await user.click(screen.getByRole('button', { name: 'Show hint 2 of 2' }))
    await user.click(screen.getByRole('button', { name: /Show the keys/ }))

    expect(screen.getByText('4w', { selector: 'code' })).toBeInTheDocument()
    expect(onSolutionShown).toHaveBeenCalledTimes(1)
  })

  it('goes straight to the keys when an exercise has no hints', () => {
    renderDetail({ exercise: practice })
    expect(screen.getByRole('button', { name: 'Show the keys' })).toBeInTheDocument()
  })

  it('forgets revealed hints when the exercise changes', async () => {
    const user = userEvent.setup()
    const { rerender } = renderDetail()
    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    rerender(<ExerciseDetail lesson={lesson} exercise={{ ...exercise, id: 'other' }} step={{ index: 0, total: 2 }} keys={[]} hasEarlier onReset={() => {}} />)
    expect(screen.queryByText('First hint')).not.toBeInTheDocument()
  })
})

describe('ExerciseDetail focus', () => {
  it('gives the editor focus back after a hint and after showing the keys', async () => {
    const user = userEvent.setup()
    const onFocusEditor = vi.fn()
    renderDetail({ onFocusEditor })
    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    expect(onFocusEditor).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Show hint 2 of 2' }))
    await user.click(screen.getByRole('button', { name: /Show the keys/ }))
    expect(onFocusEditor).toHaveBeenCalledTimes(3)
  })

  it('announces revealed hints in a live region that exists from the start', async () => {
    const user = userEvent.setup()
    renderDetail()
    const region = screen.getByRole('region', { name: 'Hints' }).querySelector('[aria-live="polite"]')!
    expect(region).toBeEmptyDOMElement()
    await user.click(screen.getByRole('button', { name: 'Show hint 1 of 2' }))
    expect(region).toHaveTextContent('First hint')
  })
})
