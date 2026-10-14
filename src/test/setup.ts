import '@testing-library/jest-dom/vitest'

// jsdom saknar layout-API:er som CodeMirror mäter med.
const emptyRects = () => {
  const list = [] as unknown as DOMRectList
  return list
}
const zeroRect = () => new DOMRect(0, 0, 0, 0)

Range.prototype.getClientRects ??= emptyRects
Range.prototype.getBoundingClientRect ??= zeroRect
Element.prototype.getClientRects ??= emptyRects
