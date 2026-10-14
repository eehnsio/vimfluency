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

/** Radnummer enligt vims `number` och `relativenumber`. */
export interface NumberOptions {
  number: boolean
  relativenumber: boolean
}

const relative: Extension = [
  lineNumbers(),
  // Avståndet är det man skriver framför `j`/`k` (`8j`). Aktuell rad visar sitt
  // riktiga nummer, som i `set number relativenumber`.
  lineNumberMarkers.compute(['doc', 'selection'], (state) => {
    const current = state.doc.lineAt(state.selection.main.head).number
    const builder = new RangeSetBuilder<GutterMarker>()
    for (let n = 1; n <= state.doc.lines; n++) {
      const text = n === current ? String(n) : String(Math.abs(n - current))
      const from = state.doc.line(n).from
      builder.add(from, from, new NumberMarker(text))
    }
    return builder.finish()
  }),
]

/** Aktiv rad (cursorline) är alltid på. Själva numren följer alternativen. */
export function lineNumberExtension({ number, relativenumber }: NumberOptions): Extension {
  const gutter = !number ? [] : relativenumber ? relative : lineNumbers()
  return [gutter, highlightActiveLine(), highlightActiveLineGutter()]
}

/** Hybridnummer, standardläget i övningarna. */
export const relativeLineNumbers = lineNumberExtension({ number: true, relativenumber: true })
