# vimfluency – plan för första skalet

## Context

Repot innehåller bara `CLAUDE.md` och `README.md`. Målet är ett första fungerande skal för en statisk sida där React-utvecklare lär sig vim genom interaktiva övningar: en kolumn till vänster med instruktioner och ett "terminal"-gränssnitt till höger med en riktig vim-editor. Övningarna är data, och varje övnings lösning bevisas av ett test. Allt körs i klienten.

När planen är godkänd sparas innehållet som `implementation.md` i repots rot (första steget).

## Beslut

| Område | Val |
|---|---|
| Bygge | Vite + React + TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Editor | CodeMirror 6 + `@replit/codemirror-vim`, `@codemirror/lang-javascript` (TSX-färgning) |
| Tester | Vitest + Testing Library (jsdom) |
| Språk | Engelska i UI och övningar, inget i18n |
| Routing | Ingen router; valt övnings-id ligger i state |
| Framsteg | `localStorage` |
| Komponenter | Egna, byggda med Tailwind. Inget komponentbibliotek. |
| Tema | Designtokens (CSS-variabler i Tailwinds `@theme`) redan i skalet. Editortemat byggs på samma tokens. Visuell finish i en senare fas. |
| Övningar | En sandbox-mapp per övning med riktiga källfiler. Skalet visar en fil åt gången. |

Övrigt: npm som pakethanterare och ESLint från Vites mall. Inga beroenden utöver de som står ovan.

## Arkitektur

Tre lager med beroenden i en riktning: **exercises (data) → engine (ren logik, ingen React) → UI (React)**. Engine används av både UI:t och testerna, så testerna bevisar exakt samma beteende som användaren möter.

### Mappstruktur

```
src/
  main.tsx
  App.tsx                    # layout: vänsterkolumn + terminalpanel
  index.css                  # Tailwind-import + theme.css
  styles/theme.css           # @theme-tokens: färger, typsnitt, spacing, radier
  exercises/
    types.ts                 # Exercise, Category, Check, VirtualFile
    define.ts                # defineExercise(meta, rawFiles) → Exercise
    registry.ts              # bara kategoriordningen + lookup (getExercise, nextExercise)
    motions/
      index.ts               # Category: metadata + ordning inom kategorin
      word-jumps/            # sandbox: en mapp per övning
        exercise.ts          # metadata, checks, lösning
        files/src/Counter.tsx  # riktiga källfiler, läses som text
    search-replace/
      index.ts
      rename-variable/{exercise.ts, files/…}
    navigation/
      index.ts
      matching-brace/{exercise.ts, files/…}
    exercises.test.ts        # bevisar alla övningar (se Tester)
  engine/
    keys.ts                  # parseKeys("3w<Esc>:%s/a/b/g<CR>") → tokens
    session.ts               # createSession(): EditorView + vim, sendKeys, getState
    checks.ts                # evaluate(checks, state) → { passed, failed[] }
    *.test.ts
  hooks/
    useExerciseSession.ts    # kopplar session till React: state, reset, completed, keystrokes
    useProgress.ts           # localStorage: färdiga övningar, senast vald
  components/
    Sidebar/ExerciseList.tsx      # grupperat per kategori, bock för klara
    Sidebar/ExerciseDetail.tsx    # titel, instruktion, hints, reset/next
    Terminal/TerminalPane.tsx     # terminal-chrome (titelrad, filflik)
    Terminal/VimEditor.tsx        # monterar CodeMirror via session.ts
    Terminal/StatusLine.tsx       # läge (NORMAL/INSERT), rad:kol, tangenter vs par
    Terminal/CompletionBanner.tsx
  test/setup.ts              # jsdom-polyfills för CodeMirror (getClientRects m.m.)
```

### Datamodell (`exercises/types.ts`)

```ts
interface Category {
  id: string;                 // 'motions', 'search-replace', ...
  title: string;
  description: string;
  exercises: Exercise[];      // ordningen här = ordningen i UI:t
}

interface VirtualFile { path: string; content: string; }

type Check =
  | { type: 'cursorAt'; line: number; col: number }          // 1-indexerat, som i vim
  | { type: 'contentEquals'; file?: string; expected: string }
  | { type: 'mode'; mode: 'normal' | 'insert' | 'visual' };

interface Exercise {
  id: string;                 // globalt unikt, kebab-case
  title: string;
  instructions: string;       // kort text, `kod` tillåten
  hints?: string[];
  files: VirtualFile[];       // från övningens files/-mapp, sökväg relativt den
  activeFile: string;         // filen som öppnas, t.ex. 'src/Counter.tsx'
  start: { line: number; col: number };
  checks: Check[];            // alla måste passera
  solution: string;           // referenslösning i vim-notation
  par?: number;               // optimalt antal tangenttryck
}
```

### Sandbox per övning

Varje övning är en egen mapp med `exercise.ts` och en `files/`-mapp med riktiga källfiler. `exercise.ts` läser in sina filer med Vites inbyggda `import.meta.glob('./files/**', { query: '?raw', import: 'default', eager: true })` och skickar dem till `defineExercise`, som gör om sökvägarna så att de blir relativa `files/`. Det kräver inget nytt beroende.
- Övningskoden skrivs som vanlig TSX med färgning och utan escaping i strängar.
- Editorn ser bara övningens egna filer. Ingenting delas mellan övningar.
- `src/exercises/**/files/**` utesluts från tsconfig och ESLint, eftersom filerna är innehåll och inte appkod. Övningar kan därför innehålla trasig kod med flit.
- Skalet öppnar bara `activeFile`. Filträd och `:e` kan läggas till senare utan att formatet ändras.

### Ordning

Ordningen bestäms på två nivåer, så ingen fil blir central eller växer okontrollerat:
- **Ny övning:** ny mapp i `exercises/<kategori>/` + en rad i kategorins `index.ts`.
- **Ändrad ordning:** flytta raden i kategorins `index.ts`, eller kategorin i `registry.ts`.
- **Ny kategori:** ny mapp med `index.ts` + en rad i `registry.ts`.

Övningar känner inte till varandra, och ingen komponentkod behöver ändras. Kategorin ges av föräldern och dupliceras inte i övningen. Behöver en övning specialtester läggs `<övning>.test.ts` bredvid den. Strukturen motsvarar en framtida route `/:category/:exerciseId`.

### Engine

- **`keys.ts`** – tolkar vim-notation till tokens: vanliga tecken, `<Esc>`, `<CR>`, `<C-o>` osv. Segment som `:…<CR>` blir ett ex-kommando.
- **`session.ts`** – `createSession({ parent?, file, start })` skapar `EditorView` med `vim()` och returnerar `{ view, sendKeys(notation), getState(), reset(), destroy() }`. Tangenter körs via `Vim.handleKey(getCM(view), key)`, ex-kommandon via `Vim.handleEx`. `getState()` ger `{ content, cursor, mode, keystrokes }`. Tangenttryck räknas via CodeMirror-vims `vim-keypress`-event.
- **`checks.ts`** – ren funktion `evaluate(checks, state)`, oberoende av CodeMirror.

### UI-flöde

`App` håller `selectedId` (initialt från `useProgress`). `useExerciseSession(exercise)` skapar sessionen, lyssnar på editoruppdateringar och lägesbyten, kör `evaluate` och sätter `completed`. När den är klar markerar `useProgress` övningen och `CompletionBanner` visar resultat (tangenter vs par) och "Next". Reset bygger om sessionen från övningens data.

Layout: CSS-grid med vänsterkolumn (~360px) och terminalpanel som fyller resten. Mörkt terminaltema och monospace i panelen.

### Styling och tema

- Alla färger, typsnitt och avstånd definieras som tokens i `styles/theme.css` (Tailwind v4 `@theme`), t.ex. `--color-surface`, `--color-fg`, `--color-accent`, `--color-term-bg` och `--font-mono`. Komponenterna använder bara tokens, aldrig hårdkodade värden.
- `engine/editorTheme.ts` bygger CodeMirror-temat (`EditorView.theme` + `HighlightStyle`) på samma CSS-variabler, så att editorn och sidan delar palett.
- Komponenterna är egna, små och byggda med Tailwind-klasser. Ett komponentbibliotek är inte aktuellt nu.
- Visuell finish (typsnitt, detaljer, animationer) blir en egen fas efter skalet. Då räcker det oftast att ändra tokens.

## Tester (varje lösning bevisas)

`exercises.test.ts` går igenom alla kategorier i `registry` och gör för varje övning:
1. **Datavalidering**: unika id (globalt och per kategori), ingen tom kategori, `start` och `cursorAt` ligger inom filen, `files` är inte tom.
2. **Inte redan löst**: checkarna faller i startläget.
3. **Lösningen fungerar**: `createSession` headless → `sendKeys(solution)` → alla checkar passerar.
4. **Par stämmer**: om `par` finns gäller `keystrokes(solution) <= par`.

Utöver det enhetstester för `keys.ts` och `checks.ts`, ett sessionstest (normal, ex och sök), samt ett komponenttest för att lista, välja övning och klarmarkering.

## Implementationsordning

1. Spara den här planen som `implementation.md` i repots rot.
2. Scaffolda med Vite (react-ts), lägg till Tailwind v4, Vitest + Testing Library + jsdom. Lägg till scripts `dev`, `build`, `test`, `typecheck`. Skapa `styles/theme.css` med grundtokens och uteslut `src/exercises/**/files/**` från tsconfig och ESLint.
3. **Spike på engine**: verifiera att `@replit/codemirror-vim` kan köras headless i jsdom för normal-kommandon, `:%s` och `/sök<CR>`. Det är planens största risk. Om `/` inte går att driva via `handleKey` i jsdom, testa via `Vim.handleEx` eller kör sökningen genom vim-API:ets search-state. Om inget av det fungerar väljer vi tillsammans mellan Playwright för just sökövningar eller att justera formatet.
4. `keys.ts`, `session.ts` och `checks.ts` med tester.
5. `types.ts`, `define.ts`, `registry.ts`, ett `index.ts` per kategori och tre startövningar som sandbox-mappar (en per kategori) plus `exercises.test.ts`:
   - *motions/word-jumps*: hoppa till ett visst identifierarnamn i en React-komponent med `w`/`b`/`e`.
   - *search-replace/rename-variable*: `:%s/count/total/g` i en `useState`-komponent.
   - *navigation/matching-brace*: hoppa till matchande `}` med `%`.
6. `engine/editorTheme.ts`, UI-komponenterna och hooks enligt strukturen ovan, med enbart tokens.
7. `useProgress` med localStorage, klarmarkering i listan och "Next".

## Verifiering

- `npm test`: alla övningar bevisas lösbara, plus enhets- och komponenttester.
- `npm run typecheck` och `npm run build` ger en statisk `dist/` utan fel.
- `npm run dev`: lös varje övning manuellt i webbläsaren och kontrollera att banner, statuslinje, reset, next och sparad progress efter omladdning fungerar.

## Utanför skalet (senare)

Visuell finish av temat, multi-fil-UI (filträd, `:e`, buffertbyte, `gd` mellan filer), router med djuplänkar, fler övningar, deploy-konfiguration.
