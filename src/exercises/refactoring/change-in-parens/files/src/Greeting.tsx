// Goal: replace everything inside the parentheses with `props`.
// `ci(` changes inside parentheses. `ci{` and `ci'` work the same way.

function Greeting({ name }) {
  return <p>{name}</p>
}