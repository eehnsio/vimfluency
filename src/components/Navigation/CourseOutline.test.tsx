import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { categories } from '../../exercises/registry'
import type { Lesson } from '../../exercises/types'
import { CourseOutline } from './CourseOutline'

const [first, second] = categories
const exercisesOf = (lessons: Lesson[]) => lessons.flatMap((lesson) => lesson.exercises)
const idsOf = (lessons: Lesson[]) => new Set(exercisesOf(lessons).map((exercise) => exercise.id))
// En lektion med flera övningar, för delvis klara lektioner.
const multi = categories.flatMap((c) => c.lessons).find((lesson) => lesson.exercises.length > 1)!

function renderOutline(overrides: Partial<Parameters<typeof CourseOutline>[0]> = {}) {
  const props = {
    categories,
    selectedId: first.lessons[0].exercises[0].id,
    completedIds: new Set<string>(),
    assistedIds: new Set<string>(),
    onSelect: vi.fn(),
    ...overrides,
  }
  render(<CourseOutline {...props} />)
  return props
}

const categoryButton = (title: string) => screen.getByRole('button', { name: new RegExp(`^${title}`) })
const lessonButton = (lesson: Lesson) => screen.getByRole('button', { name: new RegExp(`^${lesson.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) })

describe('CourseOutline', () => {
  it('lists every category and opens only the one with the selected lesson', () => {
    renderOutline({ selectedId: second.lessons[0].exercises[0].id })
    for (const category of categories) {
      expect(screen.getByRole('heading', { name: new RegExp(category.title) })).toBeInTheDocument()
    }
    expect(categoryButton(second.title)).toHaveAttribute('aria-expanded', 'true')
    expect(categoryButton(first.title)).toHaveAttribute('aria-expanded', 'false')
    expect(lessonButton(second.lessons[0])).toHaveAttribute('aria-current', 'true')
    expect(screen.queryByRole('button', { name: new RegExp(`^${first.lessons[0].title}`) })).not.toBeInTheDocument()
  })

  it('counts lessons per category and exercises in total', () => {
    renderOutline({ completedIds: idsOf(first.lessons) })
    const count = (title: string) => within(categoryButton(title)).getByLabelText(/lessons completed$/)
    expect(count(first.title)).toHaveTextContent('✓')
    expect(count(second.title)).toHaveTextContent(`0/${second.lessons.length}`)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(exercisesOf(first.lessons).length))
  })

  it('marks completed lessons, and those completed with help differently', () => {
    const [done, helped] = first.lessons
    renderOutline({ completedIds: idsOf([done, helped]), assistedIds: new Set([helped.exercises[0].id]) })
    expect(screen.getByRole('button', { name: `${done.title} (completed)` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `${helped.title} (completed with help)` })).toBeInTheDocument()
  })

  it('shows how far a lesson with several exercises has come, and opens its first unfinished exercise', async () => {
    const [done, ...rest] = multi.exercises
    const { onSelect } = renderOutline({ selectedId: done.id, completedIds: new Set([done.id]) })
    const row = screen.getByRole('button', { name: `${multi.title} (1 of ${multi.exercises.length} completed)` })
    await userEvent.click(row)
    expect(onSelect).toHaveBeenCalledWith(rest[0].id)
  })

  it('opens and closes a category with a click', async () => {
    const user = userEvent.setup()
    renderOutline()
    await user.click(categoryButton(second.title))
    expect(categoryButton(second.title)).toHaveAttribute('aria-expanded', 'true')
    expect(lessonButton(second.lessons[0])).toBeInTheDocument()

    await user.click(categoryButton(first.title))
    expect(categoryButton(first.title)).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the keys of a title as chips instead of in the text', () => {
    renderOutline({ selectedId: 'move-up-down' })
    const row = screen.getByRole('button', { name: 'Move down and up: j and k' })
    expect(Array.from(row.querySelectorAll('kbd'), (kbd) => kbd.textContent)).toEqual(['j', 'k'])
  })

  it('reports the first exercise of a lesson nothing has been done in', async () => {
    const { onSelect } = renderOutline()
    await userEvent.click(lessonButton(first.lessons[2]))
    expect(onSelect).toHaveBeenCalledWith(first.lessons[2].exercises[0].id)
  })
})
