# vimfluency

## Vad projektet gör och vilket problem det löser

Projektet är till för (framförallt) react-utvecklare som vill lära sig nvim/vim och fördelarna/styrkorna som kommer med det. Shortcuts, Motions etc.

Den ska genom ett antal interaktiva övningar t.ex:

- lära användaren att navigera i kodbaser.
- Lära användaren att söka inom en fil och ersätta text.
- grundläggande genomgång av motions.

Layouten är en kolumn till vänster (övning, instruktion, hintar, lista) och ett terminalfönster till höger med en riktig vim-editor. Terminalen startar maximerad och den gröna knappen växlar till ett mindre fönster.

Pedagogik (beslutad):

- Användaren ska ges tid att lära sig. Ingen tangenträknare, ingen "par" och ingen speedrun.
- Övningarna är **låsta**: bara tangenterna som övningen tränar fungerar. Allt annat, inklusive piltangenter, mus och inklistring, är blockerat. `r` är nödutgång (startar om övningen).
- Hintar visas en i taget i en hintruta. Efter sista hinten kan man som sista utväg visa tangenterna; då räknas övningen som klarad med hjälp (`assisted`, dämpad bock i listan).
- Målet för övningen står delvis som kommentarer överst i editorn, resten i sidopanelen.
- Efter klarad övning är editorn låst: `Enter` går vidare, `r` börjar om.
- Hoppar markören förbi målet visas en tydlig varning.
- Är texten rätt men man står kvar i insert/visual visas "Press Esc to go back to normal mode" (övningar med `mode`-check klaras först i normalt läge).
- Introt ("Start here", första kategorin): ett fejkat skal där man måste skriva `nvim` + Enter (visas en gång, sparas som `openedNvim`), sedan fyra korta övningar om radnummer, position, lägen och `:set`.

## Teknikstack och varför

- **Vite + React 19 + TypeScript (strict).** Statisk sida, ingen router.
- **Tailwind CSS v4** (`@tailwindcss/vite`). Alla färger, typsnitt och radier är tokens i `src/styles/theme.css` (`@theme static`). Komponenter och editortema använder bara tokens.
- **CodeMirror 6 + `@replit/codemirror-vim`** för editorn. `@codemirror/lang-javascript` ger TSX-färgning.
- **Vitest + Testing Library (jsdom)** för tester.
- **oxlint** (följde med Vites mall) för lint.
- **npm** som pakethanterare. `localStorage` för framsteg.

Kommandon: `npm run dev`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## Arkitekturprinciper

Övningar som data.
Varje lösning ska bevisas av ett test.
Statisk sida utan backend.

Tre lager med beroenden i en riktning: **exercises (data) → engine (ren logik, ingen React) → UI (React)**. Engine används av både UI:t och testerna, så testerna bevisar exakt samma beteende som användaren möter.

```
src/
  App.tsx                   # layout: sidopanel + terminalfönster, Enter/r efter klarad övning
  styles/theme.css          # design tokens
  exercises/
    types.ts                # Exercise, Category, Check, VirtualFile
    define.ts               # defineExercise(meta, rawFiles)
    registry.ts             # kategoriordning, getExercise, nextExercise
    <kategori>/index.ts     # Category: metadata + ordning
    <kategori>/<övning>/
      exercise.ts           # metadata, checks, lösning
      files/…               # riktiga källfiler, läses som text (?raw)
    exercises.test.ts       # bevisar alla övningar
  engine/
    keys.ts                 # parseKeys("3w<Esc>") → tangenter
    session.ts              # createSession: EditorView + vim, sendKeys, getState, reset, subscribe, lås
    checks.ts               # evaluate(checks, state, initialContent)
    lock.ts                 # whitelist av tangenter härledd från lösningen
    overshoot.ts            # upptäcker att markören hoppat förbi målet
    lineNumbers.ts          # radnummer enligt :set number/relativenumber + aktiv rad
    editorTheme.ts          # CodeMirror-tema på samma tokens
  hooks/                    # useExerciseSession, useProgress
  components/               # Sidebar/…, Terminal/… (ShellIntro = fejkat skal i introt)
  test/setup.ts             # jsdom-polyfills för layout (radbaserade)
```

Viktiga regler:

- **Ordning** styrs i `<kategori>/index.ts` (inom kategori) och `registry.ts` (kategorier). Övningar känner inte till varandra.
- **Ny övning:** ny mapp med `exercise.ts` och `files/`, plus en rad i kategorins `index.ts`. Testerna kräver att lösningen faktiskt klarar alla checkar och att övningen inte är löst vid start.
- **Checks:** `cursorAt` (kolumn valfri), `contentEquals`, `contentUnchanged`, `mode`, `option` (`:set number`/`relativenumber`). Rörelseövningar ska ha `contentUnchanged`, annars kan man radera sig till rätt position.
- **Lås:** tillåtna tangenter är lösningens tangenter plus `allowedKeys` (t.ex. `u`), alla siffror om lösningen har ett count, och `Esc`. Backspace är alltid tillåtet i insert-läge och i `:`/`/`-prompten, så man kan sudda när man skrivit fel. `sendKeys` är inte låst, så referenslösningar kan köras i tester. Utöver tangentfiltret avvisar ett `transactionFilter` inklistring, drop, IME-komposition och klipp ut. `r` är nödutgången och får därför inte vara ett normalläges-kommando i någon lösning (testas i `exercises.test.ts`).
- Övningsfilerna i `files/` är innehåll, inte appkod. De är uteslutna från tsconfig och lint och får innehålla trasig kod med flit. Filer slutar utan radbrytning så att `G` landar på sista kodraden.
- Kommentarer i övningsfiler ingår i innehållet. De får inte matcha sökmönster som lösningen använder (t.ex. `:%s/count/…`).

Kända begränsningar:

- `@replit/codemirror-vim` har `ignorecase` + `smartcase` hårdkodat för `:s` och `/`. Skriv övningar som inte beror på skiftläge.
- Pluginet klarar inte `cit` (tagg-textobjekt), `caq` (mini.ai) eller `:s///c` (bekräfta). Använd dem inte utan att först verifiera.
- `j`/`k` kräver layout. Testerna har en radbaserad polyfill i `src/test/setup.ts`. `j` via riktiga tangenter mot en monterad editor i jsdom fungerar inte, så integrationstester använder en övning med `w`.
- `:set number`, `:set nu`, `:set relativenumber` och `:set rnu` styr radnumren. De är definierade med `Vim.defineOption` i `session.ts`. `:set nu!` (toggle) stöds inte av pluginet.
- `/` och `:` öppnar en DOM-input i pluginet. `session.ts` matar in tangenterna där. Vanliga tecken i insert-läge skrivs med `view.dispatch`.
- Bygget får en Content-Security-Policy via `vite.config.ts` (bara `build`, inte dev). `style-src 'unsafe-inline'` krävs för att CodeMirror lägger in `<style>` vid körning. Nya externa resurser (typsnitt, CDN) kräver ändring där.
- macOS tryck-och-håll (accenttecken) kan inte stängas av från webben: `defaults write com.google.Chrome ApplePressAndHoldEnabled -bool false`.

## Saker agenten INTE ska göra

- Inga egna teknikval utan att först fråga
- Ingen backend, fullt client side för övningar
- Inga nya beroenden utan att fråga först
- Skriv inte övningar som inte bevisas av ett test
- Lås inte upp tangenter "för säkerhets skull". Whitelisten är en pedagogisk avsikt.
- Kopiera inte text från externa kurser (t.ex. leerobs). Egna övningar, inspirerade av struktur och idéer.

## Git och commits

- Skapa inte `Co-Authored-By`-rader och lägg inte till attribution i commits eller PR. Användaren är den som commitar.
- Kolla alltid vilka filer som är stagade med `git status`. Om inget är stagat: `git add` på alla modifierade och nya filer.
- Kör `git diff` (mot staged) för att förstå vad som commitas.
- Granska om någon ändring kräver uppdaterad dokumentation (`CLAUDE.md`, `README.md`). Finns aktuell dokumentation i repot: föreslå eller gör uppdateringen så att den är i synk.
- Hittar du flera logiska ändringar: föreslå att dela upp dem i flera mindre commits. Överväg att dela vid olika concerns eller delar av kodbasen, olika typer av ändringar (feature, fix, refactor, docs), ändrade filmönster, logisk gruppering som är lättare att reviewa, och storlek.
- Skriv commit-meddelanden i Conventional Commits-format (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
- Pusha inte och skapa inte PR utan att bli ombedd.
