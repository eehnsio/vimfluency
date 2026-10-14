/**
 * Tolkar vim-notation ("3w<Esc>:%s/a/b/g<CR>") till en platt lista tangenter
 * i det format som `Vim.handleKey` förväntar sig.
 *
 * Prompter (`:`, `/`, `?`) tolkas inte här. Om ett tecken är ett kommando eller
 * text beror på läget, så sessionen avgör det när tangenterna körs.
 */

const ALIASES: Record<string, string> = {
  '<lt>': '<',
  '<Space>': ' ',
  '<Bar>': '|',
  '<Bslash>': '\\',
}

const SPECIAL = /^<(Esc|CR|BS|Tab|Del|Up|Down|Left|Right|Home|End|[CSAM]-[^<>]+)>/

export function parseKeys(notation: string): string[] {
  const keys: string[] = []
  let i = 0
  while (i < notation.length) {
    if (notation[i] === '<') {
      const rest = notation.slice(i)
      const alias = Object.keys(ALIASES).find((a) => rest.startsWith(a))
      if (alias) {
        keys.push(ALIASES[alias])
        i += alias.length
        continue
      }
      const match = SPECIAL.exec(rest)
      if (match) {
        keys.push(match[0])
        i += match[0].length
        continue
      }
    }
    keys.push(notation[i])
    i += 1
  }
  return keys
}
