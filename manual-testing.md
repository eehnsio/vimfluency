# Manuell testning

Checklista för det som de automatiska testerna inte fångar: riktiga tangentbord och tangentbordslayouter, layout (`j`/`k`), fokus, mus, webbläsarskillnader och bygget med CSP. `npm test` bevisar redan att varje lösning klarar sina checkar, så här testas hur det känns och beter sig för en människa.

Bocka av i en kopia, inte i den här filen.

## Förberedelser

- [ ] Testa mot bygget, inte bara dev: `npm run build && npm run preview`. CSP:n finns bara i bygget.
- [ ] Börja med tom lagring: privat fönster, eller ta bort `vimfluency:progress` under DevTools → Application → Local Storage.
- [ ] Ha DevTools-konsolen öppen. Inga röda fel och inga CSP-varningar under hela körningen.
- [ ] Webbläsare: Chrome, Safari och Firefox.
- [ ] Tangentbordslayout: svensk och amerikansk. Se [Tangentbordslayout](#tangentbordslayout).

## Radnummer

- [ ] "Show line numbers" startar utan radnummer. `:set number` ger absoluta, `:set relativenumber` relativa med 0 på aktuell rad. `:set number relativenumber` ger båda, och valet i rubriken visar "Both" efteråt.
- [ ] Valet sparas: nästa övning har samma radnummer, och rubriken visar "Line numbers" med valet.
- [ ] Byt i rubriken (Absolute, Relative, Both): numren byts direkt, markören står kvar och övningen börjar inte om.
- [ ] Ladda om: valet finns kvar.
- [ ] `:set nonumber` med relativa nummer på: de relativa numren står kvar, som i nvim.

## Introt och skalet

- [ ] Första besöket visar skalet (`zsh` i titelraden), inte editorn.
- [ ] Lektionen visar "Open the editor" och förklarar det kumulativa låset och `r` en gång, utan mål och hintar, tills `nvim` är öppnat.
- [ ] Man kan skriva direkt utan att klicka.
- [ ] `ls` + Enter visar `zsh: command not found: ls` och rensar raden.
- [ ] Backspace suddar, och felet försvinner när man börjar skriva igen.
- [ ] Enter på tom rad gör ingenting.
- [ ] `nvim` + Enter öppnar editorn, titelraden visar `nvim <fil>` och markören syns i editorn utan klick.
- [ ] `vim` + Enter fungerar också.
- [ ] Ladda om sidan: skalet visas inte igen.
- [ ] Tangenterna i skalet når inte editorn (editorn är oförändrad när skalet stängts).

## Låset

Gör i några olika övningar, minst en rörelseövning, en ändringsövning och en prompt-övning (`:`/`/`).

- [ ] En tangent som inte lärts ut ännu gör ingenting och visar i gult "`x` is locked here. Use … or `r` to start over." med lektionens tangenter. Piltangenter visas som `←` `→` `↑` `↓`.
- [ ] Piltangenter, Home, End och Delete är låsta.
- [ ] Musklick i editorn flyttar inte markören, men editorn behåller fokus.
- [ ] Dubbelklick och dra markerar ingen text.
- [ ] Cmd+V och högerklick → Klistra in klistrar inte in något.
- [ ] Cmd+X klipper inte ut något.
- [ ] Dra in text från en annan flik eller ett annat program: den hamnar inte i editorn.
- [ ] Cmd+R, Cmd+L och andra webbläsargenvägar fungerar som vanligt.
- [ ] `r` i normalläge startar om övningen.
- [ ] `r` i insert-läge skriver ett `r` (prova i "Open a new line: o": `'react'`).
- [ ] Backspace suddar i insert-läge och i `:`/`/`-prompten.
- [ ] Prompten tar vilka tecken som helst (prova `x` efter `/` i "Search: / and n"), men Enter kör bara det som står där.
- [ ] Esc tar en ur insert, visual och prompten i alla övningar.
- [ ] Tab och Shift+Tab i normalläge flyttar fokus ut ur editorn (Shift+Tab till lektionen). I insert-läge är Tab låst.
- [ ] Fokus utanför editorn: statusraden säger "The editor is not focused", och Esc ger editorn fokus igen.
- [ ] Byt till ett annat program och tillbaka: meddelandet försvinner när editorn får fokus igen.
- [ ] Tryck och håll en bokstav på macOS: accentmenyn kan dyka upp, men inget accenttecken hamnar i texten.

## Feedback i statusraden

- [ ] Lägesfältet byter färg och text mellan NORMAL, INSERT och VISUAL.
- [ ] Position (`rad:kolumn`) och Top/Bot/% stämmer när man flyttar sig.
- [ ] Gå förbi målet (t.ex. `9j` i "Move down and up"): "You went past the target" visas och står kvar tills man startar om eller landar på målet.
- [ ] Rätt text men kvar i insert-läge: "That looks right. Press Esc…" visas, och övningen klaras först efter Esc.
- [ ] Bara ett meddelande syns åt gången.

## Klarad övning

- [ ] "Exercise complete" visas direkt när målet nås.
- [ ] Enter går till nästa övning och markören står i den nya editorn.
- [ ] `r` börjar om samma övning.
- [ ] Alla andra tangenter gör ingenting och editorn är låst.
- [ ] Knapparna "Start over" och "Next" fungerar med mus, och med Tab + Enter/mellanslag.
- [ ] Sista övningen med andra övningar kvar: knappen heter "First unfinished" och Enter går till den första som inte är klar.
- [ ] Sista klara övningen i en kategori: bannern säger "<Kategori> complete" och "Up next: <nästa kategori>". Sista i en lektion med flera övningar: "Lesson complete".
- [ ] Alla 81 klara: bannern säger "Course complete" med `:q`-skämtet, och det finns ingen Next-knapp.
- [ ] Bannern och bocken glider in kort (under en sekund), och står still med "Reduce motion" påslaget.

## Lektionen och målet

- [ ] Första raden i editorn är `// Goal: …`, markerad i accentfärg. Det finns inga fler kommentarer i början av filen.
- [ ] Lektionen förklarar tangenterna utan att upprepa målet eller avslöja svaret. Förklaringen är densamma i lektionens praktikövningar.
- [ ] "Keys in play" visar lektionens kommandotangenter: `0-9` istället för enskilda siffror, inga bokstäver från texten man skriver, `gg` och `dd` som ett chip.
- [ ] Hintarna visas en i taget, och efter sista hinten kommer "Still stuck? Show the keys". Efter varje klick har editorn fokus, så att man kan prova direkt.
- [ ] Skärmläsare (VoiceOver): en ny hint läses upp.
- [ ] Byter man övning börjar hintarna om från noll.
- [ ] Visa tangenterna och klara övningen: dämpad bock i kurslistan istället för grön.
- [ ] "Start over" startar om övningen och ger editorn fokus. Samma ord används i bannern och statusraden.
- [ ] Lång text scrollar i lektionen utan att terminalen flyttar sig.

## Kurslådan

- [ ] Lådan är stängd vid start. Lektionens rubrik visar kategori, plats (t.ex. `1/4`) och progress.
- [ ] Knappen i rubriken öppnar lådan från vänster, med fokus på den aktuella övningen.
- [ ] Titlarna får plats på en rad, och tangenterna visas som chips till höger (t.ex. `j` `k`).
- [ ] Alla kategorier syns med antal klara, och en helt klar kategori får en bock.
- [ ] Kategorin med den valda övningen är öppen. Klick på en annan kategori öppnar och stänger den.
- [ ] Klick på en övning öppnar den, lådan stängs och editorn får fokus, även om det är samma övning.
- [ ] Esc eller klick utanför stänger lådan och editorn får fokus igen.
- [ ] Medan lådan är öppen går det inte att nå editorn eller lektionen med Tab eller mus.
- [ ] Lådan fungerar medan skalet är öppet, och tangenterna hamnar inte i skalet.
- [ ] Ladda om: bockar, senast vald övning och "klarad med hjälp" finns kvar.

## Terminalfönstret

- [ ] Terminalen startar maximerad men går inte kant i kant: den har marginal, kant och rundade hörn, och ser ut som ett fönster.
- [ ] Gröna knappen växlar till ett mindre, centrerat fönster och tillbaka. Gula gör fönstret mindre och är avstängd när det redan är litet.
- [ ] Röda knappen stänger inget, men titelraden säger "In Vim you quit with :q. Not yet, though." i tre sekunder.
- [ ] Klick på fönsterknapparna tar inte fokus från editorn.
- [ ] Editorn behåller innehåll och läge när fönstret byter storlek.
- [ ] Långa filer scrollar och markören hålls synlig vid `G`, `gg` och `:N`.
- [ ] Smalt webbläsarfönster: inget bryts sönder så att editorn blir oanvändbar.

## Lektionen, Watch it och det kumulativa låset

- [ ] Första övningen i en lektion heter "Try it" och har "▶ Watch it". Praktikövningarna heter "Practice 1 of 2" och saknar knappen.
- [ ] "Watch it": lösningen spelas upp tangent för tangent, statusraden visar "Watch: …", knappen säger "Watching…", inga tangenter gör något i editorn, och övningen börjar om efteråt utan bock. Hintarna står kvar.
- [ ] "Watch it" i en övning med prompt ("Go to a line", första introövningen): kommandot skrivs i prompten, Enter kör det och markören flyttar sig eller radnumren visas.
- [ ] Medan "Watch it" spelar: `r` avbryter och börjar om, Tab flyttar fokus ut ur editorn, och "Start over" går att nå och trycka med tangentbordet.
- [ ] `u` ångrar: i "Modes", skriv `ihello` + Esc och tryck `u`, texten försvinner. Efter `r` gör `u` ingenting. Cmd/Ctrl+Z gör ingenting.
- [ ] Under "Keys in play" står "Everything from earlier lessons works too" (inte i första lektionen). Prova en tidigare tangent (t.ex. `j` i "Jump between words"): den fungerar. Prova en senare (t.ex. `b`): "is locked here".
- [ ] Bokstäver ur texten man ska skriva gör inget i normalläge: `w`, `o`, `l` i "Change a word", mellanslag i "Insert text", Enter i "Search". Alla ger "is locked here".
- [ ] I insert-läge och i `:`/`/`-prompten går det att skriva vad som helst, även tecken utanför lösningen, och sudda med Backspace.
- [ ] "Find a character": `f` följt av vilket tecken som helst fungerar (`fm`, `fr`), och `r` direkt efter `f` startar inte om övningen. Samma tecken utan `f` framför ger "is locked here".
- [ ] "Change inside parentheses": `ci(` fungerar, `ciw` ger "w is locked here" och Esc avbryter. `(` ensam i normalläge är låst.
- [ ] `:normal dd` och `:nmap j dd` i valfri övning: ingenting händer och statusraden säger att kommandot är låst. `j` fungerar som vanligt efteråt.
- [ ] Caps Lock på och `j`: "J is locked here. Caps Lock on?".
- [ ] Gå förbi målet: "You went past the target. Move back, or press r to start over." Gå tillbaka med `k`/`h` när de är upplåsta: övningen klaras ändå.
- [ ] Klar lektion med flera övningar: bannern säger "Lesson complete" och "Up next: <nästa lektion>". Gör om den guidade övningen i en klar lektion: "Lesson complete" utan "Up next", och Enter går till lektionens praktik.
- [ ] Kurslistan visar lektioner med tangentchips, "1/3" på en delvis klar lektion, och öppnar första oklara övningen i lektionen.

## Varje övning

Lös varje övning med tangenterna nedan, med riktigt tangentbord. Prova också ett fel och `r`. Tabellen genereras ur registret (se `exercises.test.ts` för hur sessionen byggs); kolla särskilt layoutberoende tangenter: `^` (död tangent), `$`, `{`, `}` (Alt på svensk Mac), `'`, `"`, `(`, `%`, `/`, `:`.

| Kategori | Lektion | Övning | Tangenter |
|---|---|---|---|
| Start here | Show line numbers | Try it (`intro-show-numbers`) | `:set number<CR>` |
|  | Jump with a count | Try it (`intro-line-numbers`) | `3j` |
|  |  | Practice 1 (`intro-line-numbers-2`) | `3k` |
|  | Where am I? | Try it (`intro-position`) | `2j4l` |
|  | Which mode am I in? | Try it (`intro-modes`) | `ihello<Esc>` |
|  | Everything can be configured | Try it (`intro-hide-numbers`) | `:set nonumber<CR>:set norelativenumber<CR>` |
| Basics | Move down and up: j and k | Try it (`move-up-down`) | `6j` |
|  |  | Practice 1 (`move-up-down-2`) | `5k` |
|  | Move left and right: h and l | Try it (`move-left-right`) | `17l` |
|  |  | Practice 1 (`move-left-right-2`) | `8h` |
|  | Put it together | Try it (`move-around`) | `2j12l` |
|  |  | Practice 1 (`move-around-2`) | `2k17l` |
| Motions | Jump between words | Try it (`word-jumps`) | `4w` |
|  |  | Practice 1 (`word-jumps-2`) | `6w` |
|  |  | Practice 2 (`word-jumps-3`) | `j4w` |
|  | Back one word: b | Try it (`word-back`) | `4b` |
|  |  | Practice 1 (`word-back-2`) | `2b` |
|  |  | Practice 2 (`word-back-3`) | `3b` |
|  | End of a word: e | Try it (`word-end`) | `3e` |
|  |  | Practice 1 (`word-end-2`) | `2e` |
|  |  | Practice 2 (`word-end-3`) | `5e` |
|  | Start of the line: ^ | Try it (`line-start`) | `^` |
|  |  | Practice 1 (`line-start-2`) | `0` |
|  |  | Practice 2 (`line-start-3`) | `j^` |
|  | End of the line: $ | Try it (`line-end`) | `$` |
|  |  | Practice 1 (`line-end-2`) | `j$` |
|  |  | Practice 2 (`line-end-3`) | `$` |
| Navigation | Bottom and top of the file: G and gg | Try it (`file-bottom`) | `G` |
|  |  | Practice 1 (`file-top`) | `gg` |
|  | Jump to a line number: :N | Try it (`go-to-line`) | `:15<CR>` |
|  |  | Practice 1 (`go-to-line-2`) | `:8<CR>` |
|  | Jump to the matching brace | Try it (`matching-brace`) | `%` |
|  |  | Practice 1 (`matching-brace-2`) | `%` |
|  |  | Practice 2 (`matching-brace-3`) | `%` |
| Editing | Insert text: i | Try it (`insert-before`) | `iBig <Esc>` |
|  |  | Practice 1 (`insert-before-2`) | `i there<Esc>` |
|  |  | Practice 2 (`insert-before-3`) | `3wiprice + <Esc>` |
|  | Append at the end of the line: A | Try it (`append-line-end`) | `A;<Esc>` |
|  |  | Practice 1 (`append-line-end-2`) | `A + tax<Esc>` |
|  |  | Practice 2 (`append-line-end-3`) | `jA;<Esc>` |
|  | Open a new line: o and O | Try it (`open-line`) | `oimport { useMemo } from 'react'<Esc>` |
|  |  | Practice 1 (`open-line-2`) | `Oimport { useState } from 'react'<Esc>` |
|  |  | Practice 2 (`open-line-3`) | `oconsole.log(name)<Esc>` |
|  | Change a word: cw | Try it (`change-word`) | `cwWorld<Esc>` |
|  |  | Practice 1 (`change-word-2`) | `cwuseReducer<Esc>` |
|  |  | Practice 2 (`change-word-3`) | `4wcwGoodbye<Esc>` |
| Search and replace | Search: / and n | Try it (`search-next`) | `/NOTE<CR>nn` |
|  |  | Practice 1 (`search-next-2`) | `/return<CR>n` |
|  |  | Practice 2 (`search-next-3`) | `/NOTE<CR>N` |
|  | Replace on one line: :s | Try it (`replace-current-line`) | `:s/isOpen/isVisible/<CR>` |
|  |  | Practice 1 (`replace-current-line-2`) | `:s/count/total/<CR>` |
|  |  | Practice 2 (`replace-current-line-3`) | `j:s/isOpen/isVisible/<CR>` |
|  | Rename a variable | Try it (`rename-variable`) | `:%s/count/total/g<CR>` |
|  |  | Practice 1 (`rename-variable-2`) | `:%s/item/entry/g<CR>` |
| Refactoring | Change inside parentheses: ci( | Try it (`change-in-parens`) | `ci(props<Esc>` |
|  |  | Practice 1 (`change-in-parens-2`) | `ci([]<Esc>` |
|  |  | Practice 2 (`change-in-parens-3`) | `ci(name<Esc>` |
|  | Change inside quotes: ci' and ci" | Try it (`change-in-quotes`) | `ci'Update name<Esc>` |
|  |  | Practice 1 (`change-in-quotes-2`) | `ci"Delete<Esc>` |
|  |  | Practice 2 (`change-in-quotes-3`) | `ci'./utils<Esc>` |
|  | Change inside braces: ci{ | Try it (`change-in-braces`) | `ci{handleClick<Esc>` |
|  |  | Practice 1 (`change-in-braces-2`) | `ci{title<Esc>` |
|  |  | Practice 2 (`change-in-braces-3`) | `ci{ color: 'red' <Esc>` |
|  | Find a character: f | Try it (`find-char`) | `fw` |
|  |  | Practice 1 (`find-char-2`) | `f,;` |
|  |  | Practice 2 (`find-char-3`) | `f(` |
| Deleting | Delete lines and repeat: dd and . | Try it (`delete-line-repeat`) | `dd..` |
|  |  | Practice 1 (`delete-line-repeat-2`) | `dd` |
|  |  | Practice 2 (`delete-line-repeat-3`) | `3dd` |
|  | Replace a whole line: S | Try it (`substitute-line`) | `S<section>New</section><Esc>` |
|  |  | Practice 1 (`substitute-line-2`) | `Sreturn null<Esc>` |
|  |  | Practice 2 (`substitute-line-3`) | `jSconst b = 20<Esc>` |
|  | Delete up to a character: dt | Try it (`delete-to-char`) | `dt)` |
|  |  | Practice 1 (`delete-to-char-2`) | `dtf` |
|  |  | Practice 2 (`delete-to-char-3`) | `dt)` |
| Visual mode | Select inside parentheses: vi( | Try it (`visual-inside-parens`) | `vi(d` |
|  |  | Practice 1 (`visual-inside-parens-2`) | `vi{d` |
|  |  | Practice 2 (`visual-inside-parens-3`) | `vi'd` |
|  | Select lines: V | Try it (`visual-lines`) | `Vjd` |
|  |  | Practice 1 (`visual-lines-2`) | `V2jd` |
|  |  | Practice 2 (`visual-lines-3`) | `Vkd` |

## Tangentbordslayout

Här är risken störst, eftersom låset jämför `event.key` med lösningens tecken.

- [ ] Svensk Mac: `^` är en död tangent (Shift+¨ och sedan mellanslag). "Start of the line" går att lösa, och inget `^` hamnar i texten. Ett annat sammansatt tecken (`~`) i normalläge ger "is locked here" och ändrar inget.
- [ ] Svensk Mac: i insert-läge skriver döda tangenter som vanligt (`ê`, `~`, `^`).
- [ ] Svensk Mac: `$`, `{`, `}`, `[`, `]` och `|` kräver Alt. Fungerar de som vanliga tecken i "End of the line" och "Change inside braces"?
- [ ] Svensk layout: `'`, `"`, `(`, `)`, `/`, `:` och `%` fungerar.
- [ ] Windows, svensk layout (ej verifierat): `{`, `}`, `$` med AltGr i normalläge utför kommandot, i insert-läge skrivs tecknet.
- [ ] US International: `'` och `^` är döda tangenter. "Change inside quotes" och "Start of the line" går att lösa.
- [ ] Caps Lock på: `j` blir `J`, och meddelandet frågar "Caps Lock on?".
