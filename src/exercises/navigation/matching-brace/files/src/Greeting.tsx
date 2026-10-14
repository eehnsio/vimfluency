export function Greeting({ name }: { name: string }) {
  if (!name) {
    return null
  }
  return <h1>Hello {name}</h1>
}
