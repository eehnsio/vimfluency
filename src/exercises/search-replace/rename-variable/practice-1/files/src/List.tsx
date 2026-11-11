// Goal: give the parameter the name `entry` everywhere it is used.

export function render(item) {
  const label = item.name
  return <li key={item.id}>{label}</li>
}