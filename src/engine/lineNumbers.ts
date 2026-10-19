import { RangeSetBuilder, type Extension } from '@codemirror/state'
import {
  GutterMarker,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumberMarkers,
  lineNumbers,
} from '@codemirror/view'
import type { NumberOptions } from '../exercises/types'

class NumberMarker extends GutterMarker {
  text: string
  constructor(text: string) {
    super()
    this.text = text
  }
  eq(other: NumberMarker) {
    return other.text === this.text
  }
  toDOM() {
    return document.createTextNode(this.text)
  }
}

/**
 * Avståndet är det man skriver framför `j`/`k` (`8j`). Aktuell rad visar sitt
 * riktiga nummer med `number relativenumber` (hybrid) och 0 med bara
 * `relativenumber`, som i vim.
 */
const relative = (absoluteCurrent: boolean): Extension => [
  lineNumbers(),
  lineNumberMarkers.compute(['doc', 'selection'], (state) => {
    const current = state.doc.lineAt(state.selection.main.head).number
    const builder = new RangeSetBuilder<GutterMarker>()
    for (let n = 1; n <= state.doc.lines; n++) {
      const text = n === current ? String(absoluteCurrent ? n : 0) : String(Math.abs(n - current))
      const from = state.doc.line(n).from
      builder.add(from, from, new NumberMarker(text))
    }
    return builder.finish()
  }),
]

/** Aktiv rad (cursorline) är alltid på. Själva numren följer alternativen. */
export function lineNumberExtension({ number, relativenumber }: NumberOptions): Extension {
  const gutter = relativenumber ? relative(number) : number ? lineNumbers() : []
  return [gutter, highlightActiveLine(), highlightActiveLineGutter()]
}
