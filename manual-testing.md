# Manuell testning

Checklista för det som de automatiska testerna inte fångar: riktiga tangentbord och tangentbordslayouter, layout (`j`/`k`), fokus, mus, webbläsarskillnader och bygget med CSP. `npm test` bevisar redan att varje lösning klarar sina checkar, så här testas hur det känns och beter sig för en människa.

Bocka av i en kopia, inte i den här filen.

## Förberedelser

- [ ] Testa mot bygget, inte bara dev: `npm run build && npm run preview`. CSP:n finns bara i bygget.
- [ ] Börja med tom lagring: privat fönster, eller ta bort `vimfluency:progress` under DevTools → Application → Local Storage.
- [ ] Ha DevTools-konsolen öppen. Inga röda fel och inga CSP-varningar under hela körningen.
- [ ] Webbläsare: Chrome, Safari och Firefox.
- [ ] Tangentbordslayout: svensk och amerikansk. Se [Tangentbordslayout](#tangentbordslayout).

## Introt och skalet

- [ ] Första besöket visar skalet (`zsh` i titelraden), inte editorn.
- [ ] Lektionen visar "Open the editor" och förklarar låset och `r` en gång, utan mål och hintar, tills `nvim` är öppnat.
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

- [ ] En tangent som inte är med gör ingenting och visar i gult "`x` is locked here. Use … or `r` to start over." med övningens tangenter. Piltangenter visas som `←` `→` `↑` `↓`.
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
- [ ] Låsta tecken går inte att skriva i prompten (prova `x` efter `/` i "Search: / and n").
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
- [ ] Sista övningen har ingen "Next"-knapp och Enter gör ingenting.

## Lektionen och målet

- [ ] Första raden i editorn är `// Goal: …`, markerad i accentfärg. Det finns inga fler kommentarer i början av filen.
- [ ] Lektionen förklarar tangenterna utan att upprepa målet eller avslöja svaret.
- [ ] "Keys in play" visar bara kommandotangenter: `0-9` istället för enskilda siffror, inga bokstäver från texten man skriver, `gg` och `dd` som ett chip.
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

- [ ] Terminalen startar maximerad.
- [ ] Gröna knappen växlar till ett mindre, centrerat fönster och tillbaka.
- [ ] Editorn behåller innehåll och läge när fönstret byter storlek.
- [ ] Långa filer scrollar och markören hålls synlig vid `G`, `gg` och `:N`.
- [ ] Smalt webbläsarfönster: inget bryts sönder så att editorn blir oanvändbar.

## Varje övning

Lös varje övning med tangenterna nedan, med riktigt tangentbord. Prova också ett fel och `r`.

| Kategori | Övning | Tangenter | Kolla särskilt |
|---|---|---|---|
| Start here | The numbers on the left | `3j` | Relativa radnummer uppdateras när man flyttar sig |
| | Where am I? | `2j4l` | |
| | Which mode am I in? | `ihello<Esc>` | Kräver Esc innan den klaras |
| | Everything can be configured | `:set nonumber<CR>` | Radnumren försvinner, och kommer tillbaka efter `r` |
| Basics | Move down and up | `6j` | `j`/`k` följer de synliga raderna |
| | Move left and right | `17l` | |
| | Put it together | `2j12l` | |
| Motions | Jump between words | `4w` | |
| | Back one word | `4b` | |
| | End of a word | `3e` | |
| | Start of the line | `^` | Död tangent på svensk layout |
| | End of the line | `$` | Alt+4 på svensk Mac |
| Navigation | Bottom of the file | `G` | Landar på sista kodraden |
| | Top of the file | `gg` | |
| | Jump to a line number | `:15<CR>` | Prompten syns, Backspace och Esc fungerar |
| | Jump to the matching brace | `%` | |
| Editing | Insert text | `iBig <Esc>` | Mellanslag skrivs |
| | Append at the end of the line | `A;<Esc>` | |
| | Open a new line | `oimport { useMemo } from 'react'<Esc>` | `r` och `{`/`}` skrivs i insert-läge |
| | Change a word | `cwWorld<Esc>` | `u` ångrar |
| Search and replace | Search: / and n | `/NOTE<CR>nn` | Träffen markeras |
| | Replace on one line | `:s/isOpen/isVisible/<CR>` | Bara aktuell rad ändras |
| | Rename a variable | `:%s/count/total/g<CR>` | Alla förekomster ändras |
| Refactoring | Change inside parentheses | `ci(props<Esc>` | `(` på svensk layout |
| | Change inside quotes | `ci'Update name<Esc>` | `'` på svensk layout |
| | Change inside braces | `ci{handleClick<Esc>` | Alt+Shift+8 på svensk Mac |
| | Find a character | `fw` | |
| Deleting | Delete lines and repeat | `dd..` | `.` upprepar, `u` ångrar |
| | Replace a whole line | `S<section>New</section><Esc>` | `<`, `>` och `/` skrivs |
| | Delete up to a character | `dt)` | |
| Visual | Select inside parentheses | `vi(d` | Markeringen syns innan `d` |
| | Select lines | `Vjd` | Båda raderna markeras |

## Tangentbordslayout

Här är risken störst, eftersom låset jämför `event.key` med lösningens tecken.

- [ ] Svensk Mac: `^` är en död tangent. Går "Start of the line" att lösa?
- [ ] Svensk Mac: `$`, `{`, `}`, `[`, `]` och `|` kräver Alt. Fungerar de som vanliga tecken?
- [ ] Svensk layout: `'`, `(`, `)`, `/`, `:` och `%` fungerar.
- [ ] Caps Lock på: vad händer med `j` (blir `J`, som är låst)? Meddelandet ska vara begripligt.
