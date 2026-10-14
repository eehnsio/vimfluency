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
})
