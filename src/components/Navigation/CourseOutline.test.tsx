import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { categories } from '../../exercises/registry'
import { CourseOutline } from './CourseOutline'

const [first, second] = categories
const idsOf = (...cats: typeof categories) => new Set(cats.flatMap((c) => c.exercises.map((e) => e.id)))

function renderOutline(overrides: Partial<Parameters<typeof CourseOutline>[0]> = {}) {
  const props = {
    categories,
    selectedId: first.exercises[0].id,
    completedIds: new Set<string>(),
    assistedIds: new Set<string>(),
    onSelect: vi.fn(),
    ...overrides,
  }
  render(<CourseOutline {...props} />)
  return props
}

const categoryButton = (title: string) => screen.getByRole('button', { name: new RegExp(`^${title}`) })

describe('CourseOutline', () => {
  it('lists every category and opens only the one with the selected exercise', () => {
    renderOutline({ selectedId: second.exercises[0].id })
    for (const category of categories) {
      expect(screen.getByRole('heading', { name: new RegExp(category.title) })).toBeInTheDocument()
    }
    expect(categoryButton(second.title)).toHaveAttribute('aria-expanded', 'true')
    expect(categoryButton(first.title)).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: second.exercises[0].title })).toHaveAttribute('aria-current', 'true')
    expect(screen.queryByRole('button', { name: first.exercises[0].title })).not.toBeInTheDocument()
  })

  it('shows progress per category and in total', () => {
    renderOutline({ completedIds: idsOf(first) })
    const count = (title: string) => within(categoryButton(title)).getByLabelText(/completed$/)
    expect(count(first.title)).toHaveTextContent('✓')
    expect(count(second.title)).toHaveTextContent(`0/${second.exercises.length}`)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(first.exercises.length))
  })

  it('marks completed exercises, and those completed with help differently', () => {
    const [done, helped] = first.exercises
    renderOutline({ completedIds: new Set([done.id, helped.id]), assistedIds: new Set([helped.id]) })
    expect(screen.getByRole('button', { name: `${done.title} (completed)` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `${helped.title} (completed with help)` })).toBeInTheDocument()
  })

  it('opens and closes a category with a click', async () => {
    const user = userEvent.setup()
    renderOutline()
    await user.click(categoryButton(second.title))
    expect(categoryButton(second.title)).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: second.exercises[0].title })).toBeInTheDocument()

    await user.click(categoryButton(first.title))
    expect(categoryButton(first.title)).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the keys of a title as chips instead of in the text', () => {
    renderOutline({ selectedId: 'move-up-down' })
    const row = screen.getByRole('button', { name: 'Move down and up: j and k' })
    expect(Array.from(row.querySelectorAll('kbd'), (kbd) => kbd.textContent)).toEqual(['j', 'k'])
  })

  it('reports the selected exercise', async () => {
    const { onSelect } = renderOutline()
    await userEvent.click(screen.getByRole('button', { name: first.exercises[2].title }))
    expect(onSelect).toHaveBeenCalledWith(first.exercises[2].id)
  })
})
