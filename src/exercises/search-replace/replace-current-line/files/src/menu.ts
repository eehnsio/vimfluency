// Goal: rename `isOpen` to `isVisible` on the cursor line only.
// `:s/old/new/` works on the current line. `:%s/old/new/g` works on every line.

const isOpen = true
const showMenu = isOpen
const showModal = isOpen