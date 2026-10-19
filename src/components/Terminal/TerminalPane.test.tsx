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

  it('shrinks with the yellow button, which is off once the window is small', async () => {
    render(
      <TerminalPane filename="src/a.ts">
        <p>editor</p>
      </TerminalPane>,
    )
    const yellow = screen.getByRole('button', { name: 'Make terminal smaller' })
    await userEvent.click(yellow)
    expect(screen.getByRole('button', { name: 'Maximize terminal' })).toBeInTheDocument()
    expect(yellow).toBeDisabled()
  })

  it('does not close with the red button, and says how Vim quits', async () => {
    render(
      <TerminalPane filename="src/a.ts">
        <p>editor</p>
      </TerminalPane>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Close terminal' }))
    expect(screen.getByRole('status')).toHaveTextContent('In Vim you quit with :q')
    expect(screen.getByText('editor')).toBeInTheDocument()
  })
})
