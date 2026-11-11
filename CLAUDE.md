# vimfluency

## Vad projektet gör och vilket problem det löser

Projektet är till för (framförallt) react-utvecklare som vill lära sig nvim/vim och fördelarna/styrkorna som kommer med det. Shortcuts, Motions etc.

Den ska genom ett antal interaktiva övningar t.ex:

- lära användaren att navigera i kodbaser.
- Lära användaren att söka inom en fil och ersätta text.
- grundläggande genomgång av motions.

Layouten är två kolumner: lektionen till vänster (rubrik med kategori, plats och progress, sedan steg, förklaring, "Watch it", tangenter i spel, hintar) och ett terminalfönster till höger med en riktig vim-editor. Kurslistan är en låda som börjar stängd. Knappen i lektionens rubrik öppnar den ovanpå lektionen, och Esc eller klick utanför stänger den. Terminalen startar maximerad, men med marginal, kant och rundade hörn så att den alltid ser ut som ett fönster. Den gröna knappen växlar till ett mindre fönster. Gula gör det mindre, röda stänger inte utan påminner om `:q`.

Pedagogik (beslutad):

- Användaren ska ges tid att lära sig. Ingen tangenträknare, ingen "par" och ingen speedrun.
- Kursen är **kategorier → lektioner → övningar**. En lektion lär ut en sak och äger förklaringen. Första övningen är den guidade ("Try it", med hintar och "Watch it"), resten är praktik ("Practice 1 of 2") på samma tangenter, gärna i kombination med tidigare lärda. Framsteg räknas per övning, kurslistan visar lektioner.
- **"Watch it"** (bara den guidade övningen) spelar upp referenslösningen tangent för tangent i editorn (`sendKeys` med paus), visar tangenterna i statusraden och börjar om efteråt. Räknas inte som klarad och inte som hjälp: det är lektionens "så här gör du".
- Låset är **kumulativt**: i en övning fungerar allt som lärts ut i tidigare lektioner plus hela den egna lektionen (`unlockedKeys` i `engine/curriculum.ts`). Det man lärt sig följer med, men inget lås släpps "för säkerhets skull": en tangent låses upp i lektionen som lär ut den. Allt annat, inklusive piltangenter, mus och inklistring, är blockerat. `r` är nödutgång (startar om övningen).
- Låset gäller **kommandon, inte text**: i normal- och visualläge bara upplåsta tangenter, i insert-läge och i `:`/`/`-prompten fri text (tecken, Enter, Backspace, Esc). Bokstäverna i det man skriver (`World`, `NOTE`) blir därför aldrig kommandon av misstag (testas per övning).
- Hintar visas en i taget i en hintruta. Efter sista hinten kan man som sista utväg visa tangenterna; då räknas övningen som klarad med hjälp (`assisted`, dämpad bock i kurslistan).
- Varje sak står på ett ställe. **Målet** står bara i editorn, på första raden som `// Goal: …`, och markeras (`goalLine.ts`). Inga fler kommentarer i början av filen, och inga kommentarer som avslöjar lösningen. **Förklaringen** (`instructions`) står bara i lektionen och upprepar inte något av övningarnas mål (testas). **Svaret** finns bara bakom hintarna, "Show the keys" och "Watch it".
- Texter får bara nämna tangenter som är upplåsta i lektionen (testas med en heuristik: backtick-tokens på högst tre tecken med bokstav eller siffra, plus `Esc`/`Enter`). Ska en text förklara en tangent som lösningen inte använder (`k` bredvid `j`, `0` bredvid `^`) läggs den i `allowedKeys`, så att lektionen lär ut den.
- "Keys in play" visar lektionens kommandotangenter (`lessonDisplayKeys`): inte det man skriver i insert-läge eller i en prompt, siffror som en `0-9`, och `gg`/`dd` som ett chip. Under chipsen står att allt från tidigare lektioner också fungerar.
- Efter klarad övning är editorn låst: `Enter` går vidare, `r` börjar om. Efter sista övningen går `Enter` till den första som inte är klar. Klar lektion (med flera övningar), klar kategori och klar kurs får egna avslut i bannern med "Up next".
- Hoppar markören förbi målet visas en varning ("Move back, or press r"). Trycks en låst tangent säger statusraden vilka tangenter lektionen använder och att `r` börjar om, och frågar om Caps Lock när tangenten är versalen av en upplåst.
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
    types.ts                # Exercise, Lesson, Category, Check, VirtualFile
    define.ts               # defineExercise(meta, rawFiles), activeContent, goalOf (används av testerna)
    registry.ts             # kategoriordning, allLessons, allExercises, getExercise, nextExercise, lessonOf, categoryOf
    <kategori>/index.ts     # Category: metadata + lektionsordning
    <kategori>/<lektion>/
      lesson.ts             # Lesson: titel, förklaring, övningsordning (try först, sedan practice-N)
      try/                  # den guidade övningen
        exercise.ts         # id, hintar, checks, lösning
        files/…             # riktiga källfiler, läses som text (?raw)
      practice-1/           # praktik, samma uppbyggnad
    exercises.test.ts       # bevisar alla lektioner och övningar
  engine/
    keys.ts                 # parseKeys("3w<Esc>") → tangenter
    exerciseSession.ts      # createExerciseSession: sessionen som användaren möter (lås, TSX, tema), delad av UI och tester
    curriculum.ts           # lessonKeys, lessonDisplayKeys, unlockedKeys: det kumulativa låset ur registrets ordning
    vimInput.ts             # tangentmatning (prompt/insert/normal), tangentlåset createKeyLock och textlåset createTextLock
    session.ts              # createSession: EditorView + vim, sendKeys, getState, reset, subscribe, lås
    checks.ts               # evaluate(checks, state, initialContent)
    lock.ts                 # commandKeys/taughtKeys (kommandotangenterna i en lösning), displayKeys, keyFromEvent
    goalLine.ts             # markerar `// Goal:`-raden i editorn
    overshoot.ts            # upptäcker att markören hoppat förbi målet (createOvershootTracker)
    lineNumbers.ts          # radnummer enligt :set number/relativenumber + aktiv rad
    editorTheme.ts          # CodeMirror-tema på samma tokens
  hooks/                    # useExerciseSession (session, feedback, "Watch it"), useProgress
  components/               # Navigation/ (LessonHeader, CourseDrawer, CourseOutline), Sidebar/ExerciseDetail (lektionen), Terminal/… (ShellIntro = fejkat skal i introt), ErrorBoundary (fallback istället för vit sida)
  test/setup.ts             # jsdom-polyfills för layout (radbaserade)
```

Viktiga regler:

- Skalets globala `keydown`-lyssnare ska släppa igenom tangenter vars mål ligger i `[role="dialog"]` (kurslådan), annars går lådan inte att använda medan skalet är öppet. Resten av sidan är `inert` medan lådan är öppen.
- **Ordning** styrs i `lesson.ts` (övningar i en lektion), `<kategori>/index.ts` (lektioner) och `registry.ts` (kategorier). Övningar känner inte till varandra; det kumulativa låset räknas ut i `engine/curriculum.ts` ur registrets ordning.
- **Ny övning:** ny mapp `practice-N/` i lektionen med `exercise.ts` och `files/`, plus en rad i `lesson.ts`. Kopiera en befintlig `exercise.ts`: `import.meta.glob('./files/**', …)`-raden är likadan överallt, och `defineExercise` kastar om `activeFile` inte finns i `files/`. Första raden i aktiv fil ska vara `// Goal: …`. Testerna kräver att lösningen klarar alla checkar, med alla tre radnummerval, både via `sendKeys` och via riktiga `keydown` genom låset, och att övningen inte är löst vid start. Övnings-id:n sparas i `localStorage`, så byt inte id på befintliga övningar.
- **Ny lektion:** ny mapp med `lesson.ts` och `try/`, plus en rad i kategorins `index.ts`. Titeln skrivs "Namn: tangent and tangent", så kurslistan kan visa tangenterna som chips.
- **Checks:** `cursorAt` (kolumn valfri), `contentEquals`, `contentUnchanged`, `mode`, `option` (`:set number`/`relativenumber`), `numbersShown`, `numbersHidden`. Rörelseövningar ska ha `contentUnchanged`, annars kan man radera sig till rätt position.
- **Lås:** en lektion lär ut kommandotangenterna i sina lösningar (`commandKeys`: inte text i insert-läge eller prompter) plus `allowedKeys`, alla siffror om något är ett count, och `Esc`. Upplåst i en övning är allt från tidigare lektioner plus den egna lektionen (`unlockedKeys`). I normal- och visualläge stoppas allt annat. I insert-läge och i `:`/`/`-prompten är text fri (tecken, Enter, Backspace, Esc); Tab och Ctrl-kombinationer följer låset. Tab och Shift+Tab i normalläge når aldrig pluginet men flyttar fokus ut ur editorn (annars en tangentbordsfälla, WCAG 2.1.2). Det är tillgänglighet, inte ett vim-kommando. `sendKeys` är inte låst, så referenslösningar kan köras i tester. Utöver tangentfiltret avvisar ett `transactionFilter` inklistring, drop, klipp ut och dra (`input.paste`, `input.drop`, `delete.cut`, `delete.dragged`). Blockera aldrig `input.type.compose`: pluginet skickar alla sina egna redigeringar (`d`, `c`, `x`…) med den. `r` är nödutgången och räknas som låst i normalläge även när den lärts ut som tecken, men är ett vanligt tecken i insert-läge och prompter. Därför får ingen lösning använda `r` som normalläges-kommando (testas). Övningstesterna bygger sessionen med `createExerciseSession`, samma som appen, så att låset ingår i beviset.
- **Döda tangenter och layouter:** `^`, `~` och `` ` `` är döda tangenter på svensk layout (`'` och `^` på US International). `keydown` säger bara `Dead`, och tecknet kommer via composition. Låset släpper därför igenom `Dead`/`Process`/`Unidentified` och prövar i stället det sammansatta tecknet i `createTextLock` (en `inputHandler` före pluginets, bara i normal-/visualläge). Ensam Alt (Mac: `$`, `{`) ignoreras av både låset och pluginet. AltGr (Windows, Ctrl+Alt) normaliseras i `keyFromEvent` och matas till pluginet av låset, eftersom pluginet annars läser `<C-A-{>`. Det sista är inte verifierat på Windows.
- Övningsfilerna i `files/` är innehåll, inte appkod. De är uteslutna från tsconfig och lint och får innehålla trasig kod med flit. Filer slutar utan radbrytning så att `G` landar på sista kodraden.
- Kommentarer i övningsfiler ingår i innehållet. De får inte matcha sökmönster som lösningen använder (t.ex. `:%s/count/…`).

Kända begränsningar:

- `@replit/codemirror-vim` har `ignorecase` + `smartcase` hårdkodat för `:s` och `/`. Skriv övningar som inte beror på skiftläge.
- Pluginet klarar inte `cit` (tagg-textobjekt), `caq` (mini.ai) eller `:s///c` (bekräfta). Använd dem inte utan att först verifiera.
- `j`/`k` kräver layout. Testerna har en radbaserad polyfill i `src/test/setup.ts`. `j` via riktiga tangenter mot en editor monterad i React (App-testerna) fungerar inte i jsdom, så de använder en övning med `w`. Mot `createExerciseSession` fungerar riktiga `keydown` även för `j`/`k`, vilket `exercises.test.ts` bygger på.
- Pluginets `isMac` sätts vid laddning ur `navigator.platform`, som är tomt i jsdom. Macs Alt-kombinationer (`$`, `{`) kan därför inte bevisas i tester, bara i den manuella checklistan.
- Raderas de sista raderna i filen (`dd`, `3dd` på slutet) lämnar pluginet en tomrad kvar. Låt inte en övning radera filens sista rad.
- `:set number`, `:set nu`, `:set relativenumber` och `:set rnu` styr radnumren. De är definierade med `Vim.defineOption` i `session.ts`. `:set nu!` (toggle) stöds inte av pluginet. Som i vim döljer `:set nonumber` inte relativa nummer, där behövs även `:set norelativenumber`.
- `/` och `:` öppnar en DOM-input i pluginet. `session.ts` matar in tangenterna där. Vanliga tecken i insert-läge skrivs med `view.dispatch`.
- `sendKeys` skriver direkt i promptens input. Varje övning bevisas också med riktiga `keydown`-events med `keyCode` (pluginet läser det) genom låset, se `type()` i `exercises.test.ts`. Text i insert-läge går via `sendKeys` även där, eftersom jsdom inte skriver tecken själv.
- GitHub Pages (`.github/workflows/deploy.yml`) serverar sidan under `/vimfluency/`. Workflowet sätter `PAGES_BASE`, som blir Vites `base`. Lokalt och på andra värdar är `base` roten. Använd relativa sökvägar eller Vites import för resurser, aldrig hårdkodade `/…`.
- Bygget får en Content-Security-Policy via `vite.config.ts` (bara `build`, inte dev). `style-src 'unsafe-inline'` krävs för att CodeMirror lägger in `<style>` vid körning. Nya externa resurser (typsnitt, CDN) kräver ändring där.
- macOS tryck-och-håll (accenttecken) kan inte stängas av från webben: `defaults write com.google.Chrome ApplePressAndHoldEnabled -bool false`.

## Saker agenten INTE ska göra

- Inga egna teknikval utan att först fråga
- Ingen backend, fullt client side för övningar
- Inga nya beroenden utan att fråga först
- Skriv inte övningar som inte bevisas av ett test
- Lås inte upp tangenter "för säkerhets skull". En tangent låses upp i lektionen som lär ut den (`allowedKeys` om lösningen inte använder den), och följer sedan med.
- Kopiera inte text från externa kurser (t.ex. leerobs). Egna övningar, inspirerade av struktur och idéer.

## Git och commits

- Skapa inte `Co-Authored-By`-rader och lägg inte till attribution i commits eller PR. Användaren är den som commitar.
- Kolla alltid vilka filer som är stagade med `git status`. Om inget är stagat: `git add` på alla modifierade och nya filer.
- Kör `git diff` (mot staged) för att förstå vad som commitas.
- Granska om någon ändring kräver uppdaterad dokumentation (`CLAUDE.md`, `README.md`). Finns aktuell dokumentation i repot: föreslå eller gör uppdateringen så att den är i synk.
- Hittar du flera logiska ändringar: föreslå att dela upp dem i flera mindre commits. Överväg att dela vid olika concerns eller delar av kodbasen, olika typer av ändringar (feature, fix, refactor, docs), ändrade filmönster, logisk gruppering som är lättare att reviewa, och storlek.
- Skriv commit-meddelanden i Conventional Commits-format (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
- Pusha inte och skapa inte PR utan att bli ombedd.
