// Goal: put the cursor on the third NOTE comment below.
// `/NOTE` + Enter searches. `n` goes to the next match, `N` to the previous.

function load() {
  // NOTE: cache this
  return fetchAll()
}

function save() {
  // NOTE: validate input
  return post()
}

function remove() {
  // NOTE: ask for confirmation
  return del()
}