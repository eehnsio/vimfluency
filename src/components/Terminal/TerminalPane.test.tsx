import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TerminalPane } from './TerminalPane'

describe('TerminalPane', () => {
  it('starts maximized and the green button toggles a smaller window', async () => {
    render(
      <TerminalPane filename="src/a.ts">
        <p>editor</p>
      </TerminalPane>,
    )
    const button = screen.getByRole('button', { name: 'Restore terminal size' })
    expect(button).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(button)
    expect(screen.getByRole('button', { name: 'Maximize terminal' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('editor')).toBeInTheDocument()
  })
})
