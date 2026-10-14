import '@testing-library/jest-dom/vitest'

// jsdom saknar layout. CodeMirror mäter med getClientRects/getBoundingClientRect,
// och vims vertikala rörelser (j/k) beror på resultatet. Vi låtsas därför att
// varje rad är 20px hög och varje tecken 8px bred, så att positionerna blir
// konsekventa och radbaserade.
const LINE_HEIGHT = 20
const CHAR_WIDTH = 8

function lineOf(node: Node | null): { index: number } | null {
  const element = node instanceof Element ? node : (node?.parentElement ?? null)
  const line = element?.closest('.cm-line')
  if (!line?.parentElement) return null
  return { index: Array.prototype.indexOf.call(line.parentElement.children, line) }
}

function rect(left: number, top: number, width: number): DOMRect {
  return new DOMRect(left, top, width, LINE_HEIGHT)
}

function toList(rects: DOMRect[]): DOMRectList {
  return Object.assign(rects, { item: (i: number) => rects[i] ?? null }) as unknown as DOMRectList
}

Range.prototype.getClientRects = function () {
  const line = lineOf(this.startContainer)
  if (!line) return toList([])
  const left = this.startOffset * CHAR_WIDTH
  const width = Math.max(this.endOffset - this.startOffset, 0) * CHAR_WIDTH
  return toList([rect(left, line.index * LINE_HEIGHT, width)])
}

Range.prototype.getBoundingClientRect = function () {
  return this.getClientRects()[0] ?? new DOMRect(0, 0, 0, 0)
}

Element.prototype.getClientRects = function () {
  return toList([this.getBoundingClientRect()])
}

Element.prototype.getBoundingClientRect = function () {
  const line = lineOf(this)
  if (!line) return new DOMRect(0, 0, 0, 0)
  // Element i en rad (t.ex. <br> på en tom rad) får radens position.
  return rect(0, line.index * LINE_HEIGHT, this.classList.contains('cm-line') ? 800 : 0)
}
