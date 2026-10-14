// Goal: move the cursor to the start of `setCount`, starting from `const`.
// `w` jumps to the start of the next word. A count repeats it, so `3w` jumps three words.
// Tip: punctuation such as `[` and `,` counts as a word.

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
