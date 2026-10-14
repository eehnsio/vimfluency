# vimfluency – implementation

Det här dokumentet beskriver vad som är byggt och vad som återstår. Arkitektur, regler och begränsningar finns i `CLAUDE.md`, som är källan till sanning. Den ursprungliga planen för första skalet är genomförd och ersatt av det här dokumentet.

## Byggt

| Område | Status |
|---|---|
| Skal | Vite + React + TypeScript (strict), Tailwind v4 med tokens, Vitest + Testing Library, oxlint |
| Engine | `keys`, `session`, `checks`, `lock`, `overshoot`, `lineNumbers`, `editorTheme` |
| Övningar | 8 kategorier, 28 övningar. Varje lösning bevisas av `exercises.test.ts` |
| UI | Sidopanel (övning, instruktion, tangenter i spel, hintar, lista) och terminalfönster med statusrad och kommandorad |
| Framsteg | `localStorage` via `useProgress`, bock i listan, senast vald övning kommer ihåg |
| Pedagogik | Låsta tangenter per övning, `r` som nödutgång, Enter/`r` efter klarad övning, varning vid överskjutning, relativa radnummer |

Kategorier och övningar:

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

- **Intro / "lektion 0":** ett fejkat terminalskal där man måste skriva `nvim`, följt av en guidad rundtur (radnummer, position, läge, `:set number`). Öppna frågor: obligatoriskt eller alltid synligt, vad rundturen ska innehålla.
- **Hintruta:** tydligare, med en hint i taget. Öppen fråga: ska lösningen kunna visas efter sista hinten?
- **Feedback för ändringsövningar:** meddelande när man är tillbaka i normalt läge och texten är fel (idag finns bara överskjutning för markörövningar).

Idéer:

- Easter eggs (`:q` i en övning, `:wq`/`ZZ`, bekräftelse när en kategori är klar).
- Startsida som text i editorn med progress.
- Fler övningar, och flera filer i en övning (filträd, `:e`, `gd`).
- Router med djuplänkar, deploy-konfiguration.

## Verifiering

- `npm test`: alla övningar bevisas lösbara, plus enhets-, sessions-, lås- och komponenttester.
- `npm run typecheck`, `npm run lint` och `npm run build` ger en statisk `dist/` utan fel.
- `npm run dev`: lös övningarna manuellt i webbläsaren.
