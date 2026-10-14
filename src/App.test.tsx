import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { allExercises, getExercise } from './exercises/registry'

beforeEach(() => localStorage.clear())

describe('App', () => {
  it('renders the shell with the first exercise selected', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'vimfluency' })).toBeInTheDocument()
    const first = allExercises[0]
    expect(screen.getByRole('heading', { level: 2, name: first.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: first.title })).toHaveAttribute('aria-current', 'true')
  })

  it('switches exercise and remembers the selection', async () => {
    const user = userEvent.setup()
    const target = allExercises[allExercises.length - 1]
    const { unmount } = render(<App />)
    await user.click(screen.getByRole('button', { name: target.title }))
    expect(screen.getByRole('heading', { level: 2, name: target.title })).toBeInTheDocument()
    unmount()

    render(<App />)
    const detail = screen.getByRole('article')
    expect(within(detail).getByRole('heading', { name: target.title })).toBeInTheDocument()
  })

  it('shows the file in the editor', () => {
    render(<App />)
    const first = allExercises[0]
    expect(screen.getByText(first.activeFile, { selector: 'span' })).toBeInTheDocument()
    expect(document.querySelector('.cm-content')).toHaveTextContent('Goal:')
  })
})

describe('App completion flow', () => {
  it('marks the exercise complete when the solution is typed', async () => {
    // word-jumps använder w, som inte beror på layout. j/k gör det och kan inte
    // köras mot en monterad editor i jsdom (ingen posAtCoords), men bevisas
    // i exercises.test.ts.
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    await user.keyboard(exercise.solution)
    expect(await screen.findByRole('status')).toHaveTextContent('Exercise complete')
    expect(screen.getByRole('button', { name: new RegExp(exercise.title) })).toHaveTextContent('(completed)')
    expect(JSON.parse(localStorage.getItem('vimfluency:progress')!).completed).toContain(exercise.id)
  })

  it('goes to the next exercise with Enter and locks other keys when done', async () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    await user.keyboard(exercise.solution)
    await screen.findByRole('status')

    const before = document.querySelector('.cm-content')!.textContent
    await user.keyboard('x')
    expect(document.querySelector('.cm-content')!.textContent).toBe(before)

    await user.keyboard('{Enter}')
    const next = allExercises[allExercises.indexOf(exercise) + 1]
    expect(screen.getByRole('heading', { level: 2, name: next.title })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('App locking', () => {
  it('blocks keys that are not part of the exercise and says so', async () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    await user.keyboard('b')
    expect(await screen.findByRole('alert')).toHaveTextContent('b is locked in this exercise')
    expect(screen.getByText(/Keys in play/)).toBeInTheDocument()
  })
})
