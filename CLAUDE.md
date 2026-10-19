# vimfluency

## Vad projektet gör och vilket problem det löser

Projektet är till för (framförallt) react-utvecklare som vill lära sig nvim/vim och fördelarna/styrkorna som kommer med det. Shortcuts, Motions etc.

Den ska genom ett antal interaktiva övningar t.ex:

- lära användaren att navigera i kodbaser.
- Lära användaren att söka inom en fil och ersätta text.
- grundläggande genomgång av motions.

Layouten är två kolumner: lektionen till vänster (rubrik med kategori, plats och progress, sedan förklaring, tangenter i spel, hintar) och ett terminalfönster till höger med en riktig vim-editor. Kurslistan är en låda som börjar stängd. Knappen i lektionens rubrik öppnar den ovanpå lektionen, och Esc eller klick utanför stänger den. Terminalen startar maximerad, men med marginal, kant och rundade hörn så att den alltid ser ut som ett fönster. Den gröna knappen växlar till ett mindre fönster. Gula gör det mindre, röda stänger inte utan påminner om `:q`.

Pedagogik (beslutad):

- Användaren ska ges tid att lära sig. Ingen tangenträknare, ingen "par" och ingen speedrun.
- Övningarna är **låsta**: bara tangenterna som övningen tränar fungerar. Allt annat, inklusive piltangenter, mus och inklistring, är blockerat. `r` är nödutgång (startar om övningen).
- Hintar visas en i taget i en hintruta. Efter sista hinten kan man som sista utväg visa tangenterna; då räknas övningen som klarad med hjälp (`assisted`, dämpad bock i kurslistan).
- Varje sak står på ett ställe. **Målet** står bara i editorn, på första raden som `// Goal: …`, och markeras (`goalLine.ts`). Inga fler kommentarer i början av filen, och inga kommentarer som avslöjar lösningen. **Förklaringen** (`instructions`) står bara i lektionen och upprepar inte målet (testas). **Svaret** finns bara bakom hintarna och "Show the keys".
- "Keys in play" visar bara kommandotangenterna (`displayKeys`): inte det man skriver i insert-läge eller i en prompt, siffror som en `0-9`, och `gg`/`dd` som ett chip. Låset är oförändrat och tillåter alla lösningens tangenter.
- Efter klarad övning är editorn låst: `Enter` går vidare, `r` börjar om. Efter sista övningen går `Enter` till den första som inte är klar. Klar kategori och klar kurs får egna avslut i bannern.
- Hoppar markören förbi målet visas en tydlig varning. Trycks en låst tangent säger statusraden vilka tangenter som gäller och att `r` börjar om.
- `r` heter "Start over" överallt (lektionen, bannern, statusraden). Låsregeln förklaras en gång, i skalet, inte i varje övning.
- Är fokus utanför editorn säger statusraden det, och Esc ger editorn fokus igen. Efter en hint eller "Show the keys" går fokus tillbaka till editorn, och hintarna läses upp via en `aria-live`-region.
- Är texten rätt men man står kvar i insert/visual visas "Press Esc to go back to normal mode" (övningar med `mode`-check klaras först i normalt läge).
- Introt ("Start here", första kategorin): ett fejkat skal där man måste skriva `nvim` + Enter (visas en gång, sparas som `openedNvim`; lektionskolumnen visar ingen övning och inga hintar medan skalet är öppet), sedan fem korta övningar: välj radnummer, count med `j`, position, lägen och `:set no…`.
- Radnummer är ett val. Editorn startar utan radnummer som i nvim, och första intro-övningen (`savesNumberChoice`) låter användaren slå på `:set number` (absoluta), `:set relativenumber` (relativa, 0 på aktuell rad) eller båda (hybrid). Valet sparas som `numbers` i `localStorage` och kan bytas i lektionens rubrik (byts direkt, utan att övningen börjar om). Före valet gäller hybrid. En övning kan låsa egna radnummer med `numbers`. Alla övningar bevisas med alla tre valen, så texter och hintar måste fungera oavsett val.

## Teknikstack och varför

- **Vite + React 19 + TypeScript (strict).** Statisk sida, ingen router.
- **Tailwind CSS v4** (`@tailwindcss/vite`). Alla färger, typsnitt och radier är tokens i `src/styles/theme.css` (`@theme static`). Komponenter och editortema använder bara tokens, även terminalens fönsterknappar (`window-close/minimize/zoom`). Tangenter och kod i text visas alltid med `Kbd` och `Code` (`components/Kbd.tsx`), inte egna `<kbd>`/`<code>`-stilar.
- **CodeMirror 6 + `@replit/codemirror-vim`** för editorn. `@codemirror/lang-javascript` ger TSX-färgning.
- **Vitest + Testing Library (jsdom)** för tester.
- **oxlint** (följde med Vites mall) för lint.
- **npm** som pakethanterare. `localStorage` för framsteg.

Kommandon: `npm run dev`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
En övning: `npx vitest run src/exercises -t "<övnings-id>"`.

## Arkitekturprinciper

Övningar som data.
Varje lösning ska bevisas av ett test.
Statisk sida utan backend.

Tre lager med beroenden i en riktning: **exercises (data) → engine (ren logik, ingen React) → UI (React)**. Engine används av både UI:t och testerna, så testerna bevisar exakt samma beteende som användaren möter.

```
src/
  App.tsx                   # layout: lektion + terminalfönster, kurslådan, Enter/r efter klarad övning
  styles/theme.css          # design tokens
  exercises/
    types.ts                # Exercise, Category, Check, VirtualFile
    define.ts               # defineExercise(meta, rawFiles), activeContent, goalOf (används av testerna)
    registry.ts             # kategoriordning, getExercise, nextExercise
    <kategori>/index.ts     # Category: metadata + ordning
    <kategori>/<övning>/
      exercise.ts           # metadata, checks, lösning
      files/…               # riktiga källfiler, läses som text (?raw)
    exercises.test.ts       # bevisar alla övningar
  engine/
    keys.ts                 # parseKeys("3w<Esc>") → tangenter
    exerciseSession.ts      # createExerciseSession: sessionen som användaren möter (lås, TSX, tema), delad av UI och tester
    vimInput.ts             # tangentmatning (prompt/insert/normal) och tangentlåset createKeyLock
    session.ts              # createSession: EditorView + vim, sendKeys, getState, reset, subscribe, lås
    checks.ts               # evaluate(checks, state, initialContent)
    lock.ts                 # whitelist av tangenter härledd från lösningen, displayKeys för "Keys in play"
    goalLine.ts             # markerar `// Goal:`-raden i editorn
    overshoot.ts            # upptäcker att markören hoppat förbi målet (createOvershootTracker)
    lineNumbers.ts          # radnummer enligt :set number/relativenumber + aktiv rad
    editorTheme.ts          # CodeMirror-tema på samma tokens
  hooks/                    # useExerciseSession, useProgress
  components/               # Navigation/ (LessonHeader, CourseDrawer, CourseOutline), Sidebar/ExerciseDetail (lektionen), Terminal/… (ShellIntro = fejkat skal i introt), ErrorBoundary (fallback istället för vit sida)
  test/setup.ts             # jsdom-polyfills för layout (radbaserade)
```

Viktiga regler:

- Skalets globala `keydown`-lyssnare ska släppa igenom tangenter vars mål ligger i `[role="dialog"]` (kurslådan), annars går lådan inte att använda medan skalet är öppet. Resten av sidan är `inert` medan lådan är öppen.
- **Ordning** styrs i `<kategori>/index.ts` (inom kategori) och `registry.ts` (kategorier). Övningar känner inte till varandra.
- **Ny övning:** ny mapp med `exercise.ts` och `files/`, plus en rad i kategorins `index.ts`. Kopiera en befintlig `exercise.ts`: `import.meta.glob('./files/**', …)`-raden är likadan överallt, och `defineExercise` kastar om `activeFile` inte finns i `files/`. Första raden i aktiv fil ska vara `// Goal: …`. Testerna kräver att lösningen faktiskt klarar alla checkar och att övningen inte är löst vid start.
- **Checks:** `cursorAt` (kolumn valfri), `contentEquals`, `contentUnchanged`, `mode`, `option` (`:set number`/`relativenumber`), `numbersShown`, `numbersHidden`. Rörelseövningar ska ha `contentUnchanged`, annars kan man radera sig till rätt position.
- **Lås:** tillåtna tangenter är lösningens tangenter plus `allowedKeys` (t.ex. `u`), alla siffror om lösningen har ett count, och `Esc`. Backspace är alltid tillåtet i insert-läge och i `:`/`/`-prompten, så man kan sudda när man skrivit fel. Tab och Shift+Tab i normalläge når aldrig pluginet men flyttar fokus ut ur editorn (annars en tangentbordsfälla, WCAG 2.1.2). Det är tillgänglighet, inte ett vim-kommando. I insert-läge följer Tab låset. `sendKeys` är inte låst, så referenslösningar kan köras i tester. Utöver tangentfiltret avvisar ett `transactionFilter` inklistring, drop, klipp ut och dra (`input.paste`, `input.drop`, `delete.cut`, `delete.dragged`). Blockera aldrig `input.type.compose`: pluginet skickar alla sina egna redigeringar (`d`, `c`, `x`…) med den. `r` är nödutgången och räknas som låst i normalläge även när lösningen innehåller ett `r` (t.ex. i texten man skriver), men är ett vanligt tecken i insert-läge och prompter. Därför får ingen lösning använda `r` som normalläges-kommando (testas i `exercises.test.ts`). Övningstesterna bygger sessionen med `createExerciseSession`, samma som appen, så att låset ingår i beviset.
- Övningsfilerna i `files/` är innehåll, inte appkod. De är uteslutna från tsconfig och lint och får innehålla trasig kod med flit. Filer slutar utan radbrytning så att `G` landar på sista kodraden.
- Kommentarer i övningsfiler ingår i innehållet. De får inte matcha sökmönster som lösningen använder (t.ex. `:%s/count/…`).

Kända begränsningar:

- `@replit/codemirror-vim` har `ignorecase` + `smartcase` hårdkodat för `:s` och `/`. Skriv övningar som inte beror på skiftläge.
- Pluginet klarar inte `cit` (tagg-textobjekt), `caq` (mini.ai) eller `:s///c` (bekräfta). Använd dem inte utan att först verifiera.
- `j`/`k` kräver layout. Testerna har en radbaserad polyfill i `src/test/setup.ts`. `j` via riktiga tangenter mot en monterad editor i jsdom fungerar inte, så integrationstester använder en övning med `w`.
- `:set number`, `:set nu`, `:set relativenumber` och `:set rnu` styr radnumren. De är definierade med `Vim.defineOption` i `session.ts`. `:set nu!` (toggle) stöds inte av pluginet. Som i vim döljer `:set nonumber` inte relativa nummer, där behövs även `:set norelativenumber`.
- `/` och `:` öppnar en DOM-input i pluginet. `session.ts` matar in tangenterna där. Vanliga tecken i insert-läge skrivs med `view.dispatch`.
- `sendKeys` skriver direkt i promptens input. För att bevisa att låset släpper igenom en prompt-övning skickas riktiga `keydown`-events med `keyCode` (pluginet läser det), se `exercises.test.ts`.
- GitHub Pages (`.github/workflows/deploy.yml`) serverar sidan under `/vimfluency/`. Workflowet sätter `PAGES_BASE`, som blir Vites `base`. Lokalt och på andra värdar är `base` roten. Använd relativa sökvägar eller Vites import för resurser, aldrig hårdkodade `/…`.
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
