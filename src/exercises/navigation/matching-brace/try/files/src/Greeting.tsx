// Goal: jump from the opening brace on line 2 to its closing brace.
export function Greeting({ name }: { name: string }) {
  if (!name) {
    return null
  }
  return <h1>Hello {name}</h1>
}
