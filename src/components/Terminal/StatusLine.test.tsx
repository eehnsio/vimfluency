import { render, screen } from '@testing-library/react'
import { StatusLine } from './StatusLine'

const state = { content: 'a\nb', cursor: { line: 1, col: 1 }, mode: 'normal' as const, options: { number: true, relativenumber: true } }

describe('StatusLine', () => {
  it('says which keys to use when a key is locked', () => {
    render(<StatusLine state={state} filename="a.ts" blockedKey="<Left>" keysInPlay={['0-9', 'j']} />)
    expect(screen.getByRole('alert')).toHaveTextContent('← is locked here. Use 0-9 j or r to start over.')
  })

  it('shows one message at a time, with lost focus first', () => {
    render(<StatusLine state={state} filename="a.ts" blockedKey="x" unfocused overshot />)
    expect(screen.getByRole('status')).toHaveTextContent('The editor is not focused')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
