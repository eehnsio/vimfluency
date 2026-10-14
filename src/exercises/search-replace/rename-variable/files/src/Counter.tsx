import { useState } from 'react'

export function Tally() {
  const [count, update] = useState(0)
  const double = count * 2
  return <button onClick={() => update(count + 1)}>{count} / {double}</button>
}
