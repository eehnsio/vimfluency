import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompletionBanner } from './CompletionBanner'

describe('CompletionBanner', () => {
  it('shows keystrokes against par and offers next', async () => {
    const onNext = vi.fn()
    render(<CompletionBanner keystrokes={2} par={2} onNext={onNext} onReset={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('2 keystrokes (par 2, optimal)')
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onNext).toHaveBeenCalled()
  })

  it('hides Next when there is no next exercise', () => {
    render(<CompletionBanner keystrokes={5} par={2} onReset={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).not.toHaveTextContent('optimal')
  })
})
