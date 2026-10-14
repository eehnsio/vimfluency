import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShellIntro } from './ShellIntro'

describe('ShellIntro', () => {
  it('opens the editor when nvim is typed and Enter is pressed', async () => {
    const onOpenEditor = vi.fn()
    render(<ShellIntro onOpenEditor={onOpenEditor} />)
    await userEvent.keyboard('nvim')
    expect(screen.getByTestId('prompt')).toHaveTextContent('nvim')
    expect(onOpenEditor).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    expect(onOpenEditor).toHaveBeenCalledTimes(1)
  })

  it('lets you fix a typo with Backspace', async () => {
    const onOpenEditor = vi.fn()
    render(<ShellIntro onOpenEditor={onOpenEditor} />)
    await userEvent.keyboard('nvix{Backspace}m{Enter}')
    expect(onOpenEditor).toHaveBeenCalled()
  })

  it('answers like a shell for other commands and keeps waiting', async () => {
    const onOpenEditor = vi.fn()
    render(<ShellIntro onOpenEditor={onOpenEditor} />)
    await userEvent.keyboard('ls{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent('zsh: command not found: ls')
    expect(onOpenEditor).not.toHaveBeenCalled()
  })
})
