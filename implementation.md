# vimfluency – implementation

Det här dokumentet beskriver vad som är byggt och vad som återstår. Arkitektur, regler och begränsningar finns i `CLAUDE.md`, som är källan till sanning. Den ursprungliga planen för första skalet är genomförd och ersatt av det här dokumentet.

## Byggt

| Område | Status |
|---|---|
| Skal | Vite + React + TypeScript (strict), Tailwind v4 med tokens, Vitest + Testing Library, oxlint |
| Engine | `keys`, `session`, `vimInput` (lås per läge, döda tangenter), `curriculum` (kumulativt lås), `checks`, `lock`, `overshoot`, `lineNumbers`, `editorTheme` |
| Övningar | 9 kategorier, 32 lektioner, 81 övningar (en guidad per lektion, resten praktik). Varje lösning bevisas av `exercises.test.ts`, både via `sendKeys` och via riktiga `keydown` genom låset |
| UI | Två kolumner: lektion (rubrik med plats och progress, steg, förklaring, "Watch it", tangenter i spel, hintar). Målet står bara på den markerade första raden i editorn och terminalfönster med statusrad och kommandorad. Kurslistan är en låda som börjar stängd och visar lektioner |
| Framsteg | `localStorage` via `useProgress`, bock i kurslistan, senast vald övning kommer ihåg |
| Hintar | En hint i taget i lektionskolumnen, sedan "Show the keys" som sista utväg (markeras som klarad med hjälp) |
| Pedagogik | Lektioner (förklaring → Try it → Practice), kumulativt lås som bara gäller kommandon (fri text i insert och prompter), "Watch it", `r` som nödutgång, Enter/`r` efter klarad övning, varning vid överskjutning, Caps Lock-tips, valbara radnummer |

Kategorier och övningar:

- **Start here (intro):** fejkat skal med `nvim`, välj radnummer (sparas, byts i rubriken), count med `j` och `k`, position, lägen och `u`, `:set no…`.
- **Basics:** `j`/`k`, `h`/`l`, kombinera.
- **Motions:** `w` med count, `b`, `e`, `^`/`0`, `$`. Praktiken kombinerar med `j`.
- **Navigation:** `G`/`gg`, `:N`, `%`.
- **Editing:** `i`, `A`, `o`/`O`, `cw`. Praktiken kombinerar med `w` och `j`.
- **Search and replace:** `/` + `n`/`N`, `:s`, `:%s`.
- **Refactoring:** `ci(` (`cib`), `ci'`/`ci"`, `ci{`, `f`/`;`/`,`.
- **Deleting:** `dd` + `.` och count, `S`, `dt`.
- **Visual:** `vi(`/`vi{`/`vi'` + `d`, `V` + `j`/`k` + `d`.

## Återstår

Beslutat men inte byggt:

- **Feedback för ändringsövningar:** meddelande när man är tillbaka i normalt läge och texten är fel (idag finns bara överskjutning för markörövningar). `u` är upplåst från introt, så meddelandet kan föreslå den.
- **Verifiera i webbläsare:** döda tangenter (`^` på svensk Mac) genom `createTextLock`, och AltGr på Windows. Båda är bevisade i jsdom men inte med riktigt tangentbord.

Idéer:

- Fler intro-steg (`:q`, hur man tar sig ur ett läge, `:set` av fler alternativ).
- Praktikövningar i introt och fler i Navigation och Search, där det bara finns en eller två.

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
