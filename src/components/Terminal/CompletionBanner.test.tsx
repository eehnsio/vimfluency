import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompletionBanner } from './CompletionBanner'

describe('CompletionBanner', () => {
  it('offers next and start over', async () => {
    const onNext = vi.fn()
    const onReset = vi.fn()
    render(<CompletionBanner onNext={onNext} onReset={onReset} />)
    expect(screen.getByRole('status')).toHaveTextContent('Exercise complete')
    await userEvent.click(screen.getByRole('button', { name: /^Next/ }))
    await userEvent.click(screen.getByRole('button', { name: /^Start over/ }))
    expect(onNext).toHaveBeenCalled()
    expect(onReset).toHaveBeenCalled()
  })

  it('hides Next when there is no next exercise', () => {
    render(<CompletionBanner onReset={() => {}} />)
    expect(screen.queryByRole('button', { name: /^Next/ })).not.toBeInTheDocument()
  })
})
