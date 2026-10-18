import { StateField, type EditorState, type Extension } from '@codemirror/state'
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view'

const GOAL = /^\/\/ Goal: /
const goalDecoration = Decoration.line({ class: 'cm-goal' })

function decorate(state: EditorState): DecorationSet {
  const first = state.doc.line(1)
  return GOAL.test(first.text) ? Decoration.set([goalDecoration.range(first.from)]) : Decoration.none
}

/**
 * Målet står på första raden som `// Goal: …` och är det enda stället där det
 * står. Raden markeras så att den inte ser ut som vilken kommentar som helst.
 */
export const goalLine: Extension = [
  StateField.define<DecorationSet>({
    create: decorate,
    update: (value, transaction) => (transaction.docChanged ? decorate(transaction.state) : value),
    provide: (field) => EditorView.decorations.from(field),
  }),
  EditorView.theme({
    '.cm-line.cm-goal': {
      backgroundColor: 'color-mix(in oklab, var(--color-accent) 12%, transparent)',
    },
    '.cm-line.cm-goal, .cm-line.cm-goal span': {
      color: 'var(--color-accent)',
      fontStyle: 'normal',
    },
  }),
]
