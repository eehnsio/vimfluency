import { parseKeys } from './keys'

describe('parseKeys', () => {
  it('splits plain characters', () => {
    expect(parseKeys('3w')).toEqual(['3', 'w'])
  })

  it('keeps special keys as single tokens', () => {
    expect(parseKeys('ifoo<Esc>:w<CR>')).toEqual(['i', 'f', 'o', 'o', '<Esc>', ':', 'w', '<CR>'])
  })

  it('handles modifier chords', () => {
    expect(parseKeys('<C-o>x<C-v>')).toEqual(['<C-o>', 'x', '<C-v>'])
  })

  it('resolves aliases to literal characters', () => {
    expect(parseKeys('i<lt>div><Space>')).toEqual(['i', '<', 'd', 'i', 'v', '>', ' '])
  })

  it('treats an unknown < as a literal', () => {
    expect(parseKeys('a<b')).toEqual(['a', '<', 'b'])
  })

  it('returns an empty list for an empty string', () => {
    expect(parseKeys('')).toEqual([])
  })
})
