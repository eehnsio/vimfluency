import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { categories } from '../../exercises/registry'
import { ExerciseList } from './ExerciseList'

describe('ExerciseList', () => {
  it('groups by category and marks completed exercises', () => {
    const done = categories[0].exercises[0]
    render(
      <ExerciseList categories={categories} selectedId={done.id} completedIds={new Set([done.id])} onSelect={() => {}} />,
    )
    for (const category of categories) {
      expect(screen.getByRole('heading', { name: category.title })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: `${done.title} (completed)` })).toBeInTheDocument()
  })

  it('marks exercises completed with help differently', () => {
    const done = categories[0].exercises[0]
    render(
      <ExerciseList
        categories={categories}
        selectedId="x"
        completedIds={new Set([done.id])}
        assistedIds={new Set([done.id])}
        onSelect={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: `${done.title} (completed with help)` })).toBeInTheDocument()
  })

  it('reports the selected exercise', async () => {
    const onSelect = vi.fn()
    const target = categories[1].exercises[0]
    render(<ExerciseList categories={categories} selectedId="x" completedIds={new Set()} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: target.title }))
    expect(onSelect).toHaveBeenCalledWith(target.id)
  })

  describe('finished categories', () => {
    const [first, second] = categories
    const allOf = (...cats: typeof categories) => new Set(cats.flatMap((c) => c.exercises.map((e) => e.id)))
    const heading = (title: string) => screen.getByRole('button', { name: title })

    it('are collapsed, while unfinished ones stay open', () => {
      render(
        <ExerciseList
          categories={categories}
          selectedId={second.exercises[0].id}
          completedIds={allOf(first)}
          onSelect={() => {}}
        />,
      )
      expect(heading(first.title)).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('button', { name: new RegExp(first.exercises[0].title) })).not.toBeInTheDocument()
      expect(heading(second.title)).toHaveAttribute('aria-expanded', 'true')
    })

    it('stay open while they hold the selected exercise', () => {
      render(
        <ExerciseList
          categories={categories}
          selectedId={first.exercises[0].id}
          completedIds={allOf(first)}
          onSelect={() => {}}
        />,
      )
      expect(heading(first.title)).toHaveAttribute('aria-expanded', 'true')
    })

    it('can be opened again and closed again', async () => {
      const user = userEvent.setup()
      render(
        <ExerciseList
          categories={categories}
          selectedId={second.exercises[0].id}
          completedIds={allOf(first)}
          onSelect={() => {}}
        />,
      )
      await user.click(heading(first.title))
      expect(heading(first.title)).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('button', { name: new RegExp(first.exercises[0].title) })).toBeInTheDocument()

      await user.click(heading(first.title))
      expect(heading(first.title)).toHaveAttribute('aria-expanded', 'false')
    })

    it('can be collapsed by hand before they are finished', async () => {
      const user = userEvent.setup()
      render(<ExerciseList categories={categories} selectedId="x" completedIds={new Set()} onSelect={() => {}} />)
      await user.click(heading(second.title))
      expect(heading(second.title)).toHaveAttribute('aria-expanded', 'false')
    })
  })
})
