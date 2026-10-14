import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { allExercises } from './exercises/registry'

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
    expect(screen.getByText('src/Counter.tsx', { selector: 'span' })).toBeInTheDocument()
    expect(document.querySelector('.cm-content')).toHaveTextContent('useState')
  })
})

describe('App completion flow', () => {
  it('marks the exercise complete when the solution is typed', async () => {
    const user = userEvent.setup()
    render(<App />)
    const content = document.querySelector<HTMLElement>('.cm-content')!
    content.focus()
    await user.keyboard('4w')
    expect(await screen.findByRole('status')).toHaveTextContent('Exercise complete')
    expect(screen.getByRole('button', { name: /Jump between words/ })).toHaveTextContent('(completed)')
    expect(JSON.parse(localStorage.getItem('vimfluency:progress')!).completed).toContain('word-jumps')
  })
})
