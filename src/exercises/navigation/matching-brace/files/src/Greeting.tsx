// Goal: jump from the opening brace on line 3 to its closing brace.
// `%` moves between matching brackets, braces and parentheses.
export function Greeting({ name }: { name: string }) {
  if (!name) {
    return null
  }
  return <h1>Hello {name}</h1>
}
