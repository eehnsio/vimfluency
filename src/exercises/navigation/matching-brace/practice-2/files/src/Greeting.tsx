// Goal: jump from the closing brace on the last line to its opening brace.

export function Greeting({ name }: { name: string }) {
  if (!name) {
    return null
  }
  return <h1>Hello {name}</h1>
}