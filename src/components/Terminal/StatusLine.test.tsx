import { render, screen } from '@testing-library/react'
import { StatusLine } from './StatusLine'

const state = { content: 'a\nb', cursor: { line: 1, col: 1 }, mode: 'normal' as const, options: { number: true, relativenumber: true } }

describe('StatusLine', () => {
  it('says which keys to use when a key is locked', () => {
    render(<StatusLine state={state} filename="a.ts" blockedKey="<Left>" keysInPlay={['0-9', 'j']} />)
    expect(screen.getByRole('alert')).toHaveTextContent('← is locked here. Use 0-9 j or r to start over.')
  })

  it('suggests Caps Lock when the locked key is the capital of an unlocked one', () => {
    render(<StatusLine state={state} filename="a.ts" blockedKey="J" capsLock keysInPlay={['j']} />)
    expect(screen.getByRole('alert')).toHaveTextContent('J is locked here. Caps Lock on? Use j or r to start over.')
  })

  it('tells you to move back or start over when you went past the target', () => {
    render(<StatusLine state={state} filename="a.ts" overshot />)
    expect(screen.getByRole('alert')).toHaveTextContent('You went past the target. Move back, or press r to start over.')
  })

  it('shows the keys of a running demo before anything else', () => {
    render(<StatusLine state={state} filename="a.ts" demo={['3', 'j']} blockedKey="x" unfocused />)
    expect(screen.getByRole('status')).toHaveTextContent('Watch: 3 j')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows one message at a time, with lost focus first', () => {
    render(<StatusLine state={state} filename="a.ts" blockedKey="x" unfocused overshot />)
    expect(screen.getByRole('status')).toHaveTextContent('The editor is not focused')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
