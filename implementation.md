# vimfluency – implementation

Det här dokumentet beskriver vad som är byggt och vad som återstår. Arkitektur, regler och begränsningar finns i `CLAUDE.md`, som är källan till sanning. Den ursprungliga planen för första skalet är genomförd och ersatt av det här dokumentet.

## Byggt

| Område | Status |
|---|---|
| Skal | Vite + React + TypeScript (strict), Tailwind v4 med tokens, Vitest + Testing Library, oxlint |
| Engine | `keys`, `session`, `checks`, `lock`, `overshoot`, `lineNumbers`, `editorTheme` |
| Övningar | 9 kategorier, 32 övningar. Varje lösning bevisas av `exercises.test.ts` |
| UI | Två kolumner: lektion (rubrik med plats och progress, förklaring, tangenter i spel, hintar). Målet står bara på den markerade första raden i editorn och terminalfönster med statusrad och kommandorad. Kurslistan är en låda som börjar stängd |
| Framsteg | `localStorage` via `useProgress`, bock i kurslistan, senast vald övning kommer ihåg |
| Hintar | En hint i taget i lektionskolumnen, sedan "Show the keys" som sista utväg (markeras som klarad med hjälp) |
| Pedagogik | Låsta tangenter per övning, `r` som nödutgång, Enter/`r` efter klarad övning, varning vid överskjutning, relativa radnummer |

Kategorier och övningar:

- **Start here (intro):** fejkat skal med `nvim`, radnummer, position, lägen, `:set nonumber`.
- **Basics:** `j`/`k`, `h`/`l`, kombinera.
- **Motions:** `w` med count, `b`, `e`, `^`, `$`.
- **Navigation:** `G`, `gg`, `:N`, `%`.
- **Editing:** `i`, `A`, `o`, `cw`.
- **Search and replace:** `/` + `n`, `:s`, `:%s`.
- **Refactoring:** `ci(`, `ci'`, `ci{`, `f`.
- **Deleting:** `dd` + `.`, `S`, `dt`.
- **Visual:** `vi(` + `d`, `V` + `j` + `d`.

## Återstår

Beslutat men inte byggt:

- **Feedback för ändringsövningar:** meddelande när man är tillbaka i normalt läge och texten är fel (idag finns bara överskjutning för markörövningar).

Idéer:

- Fler intro-steg (`:q`, hur man tar sig ur ett läge, `:set` av fler alternativ).

- Easter eggs (`:q` i en övning, `:wq`/`ZZ`, bekräftelse när en kategori är klar).
- Startsida som text i editorn med progress.
- Fler övningar, och flera filer i en övning (filträd, `:e`, `gd`).
- Router med djuplänkar.
- Slutlig värd. GitHub Pages körs som experiment, Vercel är alternativet.

## Verifiering

- CI (`.github/workflows/ci.yml`) kör lint, typecheck, test och build på varje PR och push till `main`.
- Deploy (`.github/workflows/deploy.yml`) kör testerna och publicerar till GitHub Pages vid push till `main`.
- `npm test`: alla övningar bevisas lösbara, plus enhets-, sessions-, lås- och komponenttester.
- `npm run typecheck`, `npm run lint` och `npm run build` ger en statisk `dist/` utan fel.
- Manuellt: gå igenom `manual-testing.md` mot `npm run build && npm run preview`.
