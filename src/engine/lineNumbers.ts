import { RangeSetBuilder, type Extension } from '@codemirror/state'
import {
  GutterMarker,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumberMarkers,
  lineNumbers,
} from '@codemirror/view'

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
 * Hybrid-radnummer som i `set number relativenumber`: aktuell rad visar sitt
 * riktiga nummer och övriga visar avståndet till markören. Avståndet är det
 * man skriver framför `j`/`k` (`8j`).
 */
export const relativeLineNumbers: Extension = [
  lineNumbers(),
  lineNumberMarkers.compute(['doc', 'selection'], (state) => {
    const current = state.doc.lineAt(state.selection.main.head).number
    const builder = new RangeSetBuilder<GutterMarker>()
    for (let n = 1; n <= state.doc.lines; n++) {
      const text = n === current ? String(n) : String(Math.abs(n - current))
      builder.add(state.doc.line(n).from, state.doc.line(n).from, new NumberMarker(text))
    }
    return builder.finish()
  }),
  highlightActiveLine(),
  highlightActiveLineGutter(),
]
