import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { allExercises, categories, getExercise } from './exercises/registry'

beforeEach(() => localStorage.clear())

/** En riktig `keydown` med `keyCode` till editorn, eller till prompten om den är öppen. */
function typeInEditor(key: string) {
  const editor = document.querySelector('.cm-editor')!
  const input = editor.querySelector('input')
  const target = input ?? editor.querySelector('.cm-content')!
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  Object.defineProperty(event, 'keyCode', { value: key === 'Enter' ? 13 : key.toUpperCase().charCodeAt(0) })
  target.dispatchEvent(event)
  if (input && key.length === 1) {
    input.value += key
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

describe('App', () => {
  it('starts on the first exercise', () => {
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], openedNvim: true }))
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'vimfluency' })).toBeInTheDocument()
    const first = allExercises[0]
    expect(screen.getByRole('heading', { level: 2, name: first.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start here 1\/5/ })).toBeInTheDocument()
    expect(document.querySelector('.cm-goal')).toHaveTextContent('// Goal: turn on line numbers')
    // Som i nvim: inga radnummer förrän man slår på dem, och inget val i rubriken än.
    expect(document.querySelector('.cm-lineNumbers')).toBeNull()
    expect(screen.queryByRole('combobox', { name: 'Line numbers' })).not.toBeInTheDocument()
  })

  it('opens the course closed-by-default drawer, switches exercise and remembers it', async () => {
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], openedNvim: true }))
    const user = userEvent.setup()
    const lastCategory = categories[categories.length - 1]
    const target = lastCategory.exercises[lastCategory.exercises.length - 1]
    const { unmount } = render(<App />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Start here/ }))
    const drawer = screen.getByRole('dialog', { name: 'Course' })
    expect(within(drawer).getByRole('button', { name: allExercises[0].title })).toHaveFocus()
    await user.click(within(drawer).getByRole('button', { name: new RegExp(`^${lastCategory.title}`) }))
    await user.click(within(drawer).getByRole('button', { name: target.title }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: target.title })).toBeInTheDocument()
    expect(document.activeElement).toHaveClass('cm-content')
    unmount()

    render(<App />)
    const detail = screen.getByRole('article')
    expect(within(detail).getByRole('heading', { name: target.title })).toBeInTheDocument()
  })

  it('closes the drawer with Esc and gives the editor focus back', async () => {
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], openedNvim: true }))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Start here/ }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toHaveClass('cm-content')
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
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
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

describe('App milestones', () => {
  const finish = async (completed: string[]) => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed, lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    await user.keyboard(exercise.solution)
    return screen.findByRole('status')
  }

  it('celebrates a finished category', async () => {
    const motions = categories.find((c) => c.exercises.some((e) => e.id === 'word-jumps'))!
    const others = motions.exercises.map((e) => e.id).filter((id) => id !== 'word-jumps')
    expect(await finish(others)).toHaveTextContent(`${motions.title} complete`)
  })

  it('celebrates the whole course, and the last exercise has nowhere to go', async () => {
    const others = allExercises.map((e) => e.id).filter((id) => id !== 'word-jumps')
    expect(await finish(others)).toHaveTextContent('Course complete')
  })
})

describe('App overshoot feedback', () => {
  it('says so when the cursor jumps past the target, and r recovers', async () => {
    const exercise = getExercise('word-jumps')! // 4w från (8,3) till (8,17)
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()

    await user.keyboard('6w')
    expect(await screen.findByRole('alert')).toHaveTextContent('You went past the target')
    await user.keyboard('r')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('App locking', () => {
  it('lets r start the exercise over when stuck', async () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    const position = () => screen.getByText(/^\d+:\d+$/).textContent
    const start = position()

    await user.keyboard('w')
    expect(position()).not.toBe(start)
    await user.keyboard('b') // låst, men inte nödutgången
    await user.keyboard('r')
    expect(position()).toBe(start)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('blocks keys that are not part of the exercise and says so', async () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    await user.keyboard('b')
    expect(await screen.findByRole('alert')).toHaveTextContent('b is locked here. Use 0-9 w or r to start over.')
    expect(screen.getByText(/Keys in play/)).toBeInTheDocument()
  })
})

describe('App intro shell', () => {
  it('starts in a shell on the first exercise and opens the editor with nvim', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText(/Don't be scared/)).toBeInTheDocument()
    expect(screen.getByTestId('prompt')).toBeInTheDocument()
    // Ingen övning och inga hintar innan editorn är öppen.
    expect(screen.queryByRole('heading', { name: allExercises[0].title })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Hints' })).not.toBeInTheDocument()

    await user.keyboard('nvim{Enter}')
    expect(screen.queryByTestId('prompt')).not.toBeInTheDocument()
    expect(screen.getByText('nvim src/App.tsx')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: allExercises[0].title })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('vimfluency:progress')!).openedNvim).toBe(true)
  })

  it('lets the course drawer take keys while the shell is open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Start here/ }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByTestId('prompt')).toBeInTheDocument()
  })

  it('does not show the shell again once nvim has been opened', () => {
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], openedNvim: true }))
    render(<App />)
    expect(screen.queryByTestId('prompt')).not.toBeInTheDocument()
  })

  it('does not show the shell on other exercises', () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    render(<App />)
    expect(screen.queryByTestId('prompt')).not.toBeInTheDocument()
  })
})

describe('App line numbers', () => {
  it('saves the kind chosen in the intro and uses it in the next exercise', async () => {
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], openedNvim: true }))
    const user = userEvent.setup()
    render(<App />)
    // Pluginets prompt läser `keyCode`, som userEvent inte sätter. Samma knep som i exercises.test.ts.
    act(() => {
      for (const key of [...':set relativenumber', 'Enter']) typeInEditor(key)
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Exercise complete')
    expect(JSON.parse(localStorage.getItem('vimfluency:progress')!).numbers).toEqual({ number: false, relativenumber: true })

    await user.keyboard('{Enter}')
    expect(screen.getByRole('combobox', { name: 'Line numbers' })).toHaveValue('relative')
  })

  it('switches line numbers from the header without starting the exercise over', async () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id, openedNvim: true }))
    const user = userEvent.setup()
    render(<App />)
    document.querySelector<HTMLElement>('.cm-content')!.focus()
    await user.keyboard('w')
    const position = screen.getByText(/^\d+:\d+$/).textContent

    await user.selectOptions(screen.getByRole('combobox', { name: 'Line numbers' }), 'absolute')
    expect(JSON.parse(localStorage.getItem('vimfluency:progress')!).numbers).toEqual({ number: true, relativenumber: false })
    expect(screen.getByText(/^\d+:\d+$/).textContent).toBe(position)
  })
})

describe('App focus', () => {
  it('says when the editor has lost focus, and Esc brings it back', async () => {
    const exercise = getExercise('word-jumps')!
    localStorage.setItem('vimfluency:progress', JSON.stringify({ completed: [], lastId: exercise.id }))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^Start over/ }))
    expect(document.activeElement).toHaveClass('cm-content')

    screen.getByRole('button', { name: /show all exercises/ }).focus()
    expect(await screen.findByText(/The editor is not focused/)).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(document.activeElement).toHaveClass('cm-content')
    expect(screen.queryByText(/The editor is not focused/)).not.toBeInTheDocument()
  })
})
