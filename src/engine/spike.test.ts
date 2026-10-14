import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Vim, getCM, vim } from '@replit/codemirror-vim'

function make(doc: string, line = 1, col = 1) {
  const view = new EditorView({
    state: EditorState.create({ doc, extensions: [vim()] }),
    parent: document.body,
  })
  const cm = getCM(view)!
  cm.setCursor(line - 1, col - 1)
  const keys = (ks: string[]) => ks.forEach((k) => Vim.handleKey(cm, k, 'user'))
  const pos = () => {
    const c = cm.getCursor()
    return { line: c.line + 1, col: c.ch + 1 }
  }
  return { view, cm, keys, pos, text: () => view.state.doc.toString() }
}

describe('spike: vim headless in jsdom', () => {
  it('normal motions', () => {
    const s = make('const count = 1')
    s.keys(['w', 'w', 'w'])
    expect(s.pos()).toEqual({ line: 1, col: 15 })
  })

  it('ex substitute', () => {
    const s = make('count count\ncount')
    Vim.handleEx(s.cm as Parameters<typeof Vim.handleEx>[0], '%s/count/total/g')
    expect(s.text()).toBe('total total\ntotal')
  })

  it('search via prompt input', () => {
    const s = make('foo\nbar\nbaz')
    s.keys(['/'])
    const input = s.view.dom.querySelector('input')!
    expect(input).toBeTruthy()
    input.value = 'baz'
    input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, key: 'Enter', bubbles: true }))
    expect(s.pos()).toEqual({ line: 3, col: 1 })
  })

  it('ex via prompt input', () => {
    const s = make('count count')
    s.keys([':'])
    const input = s.view.dom.querySelector('input')!
    input.value = '%s/count/total/g'
    input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, key: 'Enter', bubbles: true }))
    expect(s.text()).toBe('total total')
  })

  it('percent matches brace', () => {
    const s = make('function f() {\n  return 1\n}')
    s.cm.setCursor(0, 13)
    s.keys(['%'])
    expect(s.pos()).toEqual({ line: 3, col: 1 })
  })

  it('insert mode', () => {
    const s = make('abc')
    s.keys(['i'])
    s.view.dispatch(s.view.state.replaceSelection('X'))
    s.keys(['<Esc>'])
    expect(s.text()).toBe('Xabc')
  })
})
