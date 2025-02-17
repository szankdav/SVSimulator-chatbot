---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
layout: image
image: /assets/img/background.jpg
backgroundSize: cover
# some information about your slides (markdown enabled)
title: Discord bot és log program
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

<div class="mt-15">
  <h1 style="color: white">Discord bot és üzenet naplózó program</h1>
</div>

<div class="mt-55">
<h3 style="color: white">Mi fán terem a bot, és egyáltalán...</h3>
</div>

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Lássuk <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <button @click="$slidev.nav.openInEditor" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/szankdav/SVSimulator-chatbot" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

---
transition: fade-out
---

## A projekt célja

Ez a projekt tanulási céllal jött létre, melynek eredményeképp megtudhatjuk mi az a discord bot, bepillantást nyerhetünk annak felépítésébe és működési logikájába. Megtanuljuk mi az az MVC pattern (modell-nézet-vezérlő programtervezési minta), amit követtünk a program létrehozása során, kis kitekintéssel az SQLite3 adatbázisra, és, hogy miért jó a SSR (server-side rendering). Végül megtudjuk, hogyan tudjuk használni a programot.

<div class="flex">
<div @click="$slidev.nav.next" class="mt-20 py-1 text-center">
  <p hover:bg="white op-10">Induljunk, csak nehogy megBOToljunk <carbon:arrow-right /></p>
  </div>
  <img src="./assets/img/husky-pun.gif" class="w-80 ml-60" style="border-radius: 20%"></img>
</div>

---
transition: slide-up
---

<div>
  <h1 style="color: white">Mi a Discord</h1>
</div>

A Discord egy ingyenes VoIP-alkalmazás amelyet legfőképp videójáték-közösségek számára terveztek, de nem zár ki más témájú közösséget sem.

<img class="ml-90" src="./assets/img/discord.jpg" alt="discord" width="20%" style="border-radius: 50%">

<div class="text-center mt-10">
Ha többet szeretnél tudni a Discord-ról, katt a képre!
</div>

<div @click="$slidev.nav.next" class="mt-12 py-1 text-center" hover:bg="white op-10">
  ...és mi a bot <carbon:arrow-right />
</div>

<!--
A Discordot úgy tervezték, hogy nagy rendszerigényű programok (leginkább videójátékok) futtatása mellett is gördülékenyen lehessen használni. A platform rendelkezik szöveges, kép- és videó-, valamint audiokommunikációval is. A Discord Windows, MacOS, Android, iOS, Linux operációs rendszereken és böngészőkön fut. A platformnak 2019. július 21-én több mint 250 millió felhasználója volt.
-->

---

<div>
  <h1 style="color: white">Discord bot</h1>
</div>

<div>
A Discordon található (ro)botok olyan alkalmazások, amelyek számos hasznos feladatot képesek automatikusan végrehajtani a szerveren.
Ebbe beletartozik bármi, amit az alkalmazás fejlesztője kódol a bot viselkedésébe. Lehet szó akár az új tagok fogadásáról, a "bajkeverők" kitiltásáról és a vita moderálásáról. Egyes botok még zenét vagy játékokat is hozzáadnak a szerverhez.
</div>

<div class="flex">
<div @click="$slidev.nav.next" class="mt-25 ml-30 py-1">
  <p hover:bg="white op-10">Úristen, hát ki tud ilyet létrehozni? <carbon:arrow-right /></p>
</div>
<img class="ml-40" src="./assets/img/bot.jpg" alt="discord" width="55%">
</div>

<!--
A bot – a robot rövidítése, más néven internetes bot – olyan számítógépes program, amely egy felhasználó vagy más program "ügynökeként" működik, vagy emberi tevékenységet szimulál. A robotokat általában bizonyos feladatok automatizálására használják, ami azt jelenti, hogy az emberi utasítások nélkül is futhatnak.
-->

---

<img class="ml-55" src="./assets/img/divine_programmer.jpg" alt="discord" width="55%">

---

<div>
  <h1 style="color: white">És én!</h1>
</div>

<div>
Egyszóval bárki, akinek van egy alapszintű, de abból azért erős programozási tudása. Szerencsére az egyszerű, halandó embereknek nagyon jó (polkorrekt vagyok, nah) dokumentáció áll rendelkezésére:<br><br>
<a href="https://discordjs.guide/#before-you-begin" target="_blank">Hogyan készítsünk bot-ot</a>
</div>
<br>
<div>
A programban található bot is ennek a dokumentációnak a segítségével készült.<br><br>
A feladat nagyobbik részét leveszi a vállunkról a <a href="https://discord.com/developers/applications" target="_blank">Discord developer portal</a>, ahol létre kell hoznunk a botunkat, mint alkalmazást. Tehát valójában mi "csak" a létező bot-ot példányosítjuk, és csatlakoztatjuk a megfelelő szerverhez egy ID segítségével. A mi feladatunk a programunkban a bot viselkedésének programozása. 
</div>

<div @click="$slidev.nav.next" class="mt-15 text-center py-1">
  <p hover:bg="white op-10">Viselkedjél! <carbon:arrow-right /></p> 
</div>

---

<div>
  <h1 style="color: white">A bot "betanítása"</h1>
</div>

<div>
A botunk végeredményben egy chatbot, de mégsem az. Nem csak közvetlen kommunikáció útján képes parancsok végrehajtására. Én inkább úgy tekintek rá, mint egy automatizált asszisztens. A fejlesztés során mi programozzuk bele a "tudást", ami a különbőző parancsok végrehajtásához szükséges. 
</div>

<img class="ml-50 mt-10" src="./assets/img/smart_bot.jpg" alt="discord" width="55%">

<div @click="$slidev.nav.next" class="mt-15 text-center py-1">
  <p hover:bg="white op-10">Mit jelent az, hogy nem csak közvetlen kommunikáció útján képes a parancsok végrehajtására? <carbon:arrow-right /></p> 
</div>

<!--
Sok helyen AI chatbot-ként hivatkoznak a Discord botokra is, ami kicsit hamis kijelentés. Hacsak nem tápláltunk bele rengeteg információval rendelkező adatbázist, és készültünk fel mindenféle kérdés eshetőségére, vagy nem kötöttük össze őt egy másik chatbottal, például a ChatGPT-vel, (fun fact: a chatGPT nem más, mint egy baromi sok fehérjét ivott chatbot, ami értelmezőmodelleket használ, de ezt most itt bővebben nem fogom kifejteni) akkor a bot annyi parancsot lesz képes végrehajtani, és csak olyan válasszal, vagy tevékenységgel fog tudni szolgálni, amiket mi a programozás során megírtunk.
-->

---

<div>
  <h1 style="color: white">Mindig figyel...</h1>
</div>

<div>
A programunkban tehát mi "tanítjuk" meg a bot-nak, amit tudnia kell, és amit "csinálnia" kell. A fejlesztéshez a már említett csodálatosan átlátható és érthető (szarkazmus?) dokumentáció áll rendelkezésre:<br><br>
<a href="https://discordjs.guide/#before-you-begin" target="_blank">discord.js Guide</a>
</div><br>

<div>
A dokumentációban rengeten felhasználási lehetőségről olvashatunk, nekünk azonban kapóra jön egy, amivel képesek leszünk a háttérben, külön parancs kiadása nélkül naplózni a csatornán elküldött üzeneteket. A bot rendelkezik úgynevezett eseményfigyelővel, azaz listenerrel. Ezzel megadhatjuk, hogy a bot adott esemény beteljesülésekor milyen kódot futtasson, vagyis mit csináljon.
</div>
<div class="flex">
<div @click="$slidev.nav.next" class="mt-20 ml-50 py-1">
  <p hover:bg="white op-10">Összegezve<carbon:arrow-right /></p> 
</div>
  <img class="ml-70 mt-10" src="./assets/img/eyes.jpg" alt="discord" width="25%">
</div>

<!--
A messageCreate eseményt figyelve, amikor egy üzenet elküldésre kerül a szerveren, a bot le fogja futtatni a kívánt kódot, automatikusan.
-->

---

<div>
  <h1 style="color: white">Eddig mit tudunk</h1>
</div><br>

<div>
A Discord egy multifunkcionális kommunikációs platform, ahol lehetőségünk van saját szerverek létrehozására, és ezeken a szervereken bot-ok futtatására, amik képesek ellátni különbőző, általunk megadott feladatokat.
</div><br>

<div>
Mi azt a célt tűztük ki, hogy az egyik ilyen feladata a botnak a szöveges üzenetek naplózása legyen.
</div><br>

<div @click="$slidev.nav.next" class="mt-20 text-center py-1">
  <p hover:bg="white op-10">A naplózás<carbon:arrow-right /></p> 
</div>

---

<div>
  <h1 style="color: white">A naplózó, a.k.a. logger program</h1>
</div><br>

<div>
A cél:<br>
Ha valaki üzenetet küld a szerveren, ahol a mindenható botunk figyel, ezt az üzenetet küldje tovább a bot egy programnak, ami eltárolja ezt az üzenetet és a hozzá tartozó, szükséges adatokat.
</div><br>

<div>
<ul>Azok a megvalósításhoz használt technológiák, amik bemutatása kerülnek:
  <li>MVC programtervezési minta</li>
  <li>SQLite3 az adatbázis kezeléséhez</li>
  <li>SSR, szerveroldali renderelés</li>
</ul>  
</div><br>

<div @click="$slidev.nav.next" class="mt-8 text-center py-1">
  <p hover:bg="white op-10">Haladjunk sorban<carbon:arrow-right /></p> 
</div>

<!-- 
Sok egyéb tech<br>
MVC: modell view controller, vagyis Modell-nézet-vezérlő minta<br>
SSR: server side rendering
 -->

---

<div>
  <h1 style="color: white">MVC programtervezési minta</h1>
</div><br>

A model-view-controller egyike a számos programtervezési mintának (design patterns). A programtervezési minták olyan újrafelhasználható megoldások, melyek gyakori problémákat oldanak meg. Nem konkrét kódot, implementiációt kell érteni alatta, hanem egy útmutatót (paradigmát), mely az adott probléma megoldására kínál egy bejáratott megoldást. Forrás: <a href="https://mernokinformatikus.hu/tervezesi-mintak-a-gyakorlatban/" target="_blank">Tervezési minták</a>

<div class="flex">
<div class="mt-15">
Az MVC elsősorban egy tervezési minta. Segítségével szétválaszthatjuk az adathoz, és a felhasználói felülethez tartozó dolgokat.
<div @click="$slidev.nav.next" class="mt-8 text-center py-1">
  <p hover:bg="white op-10">SQLite3<carbon:arrow-right /></p>
</div>
</div>
  <img class="ml-10" src="./assets/img/MNV.jpg" alt="discord" width="30%"> 
</div>
<!-- 
A modell-nézet-vezérlő (MNV) (angolul model-view-controller) a szoftvertervezésben használatos programtervezési minta.[1] Gyakori fejlesztői kívánalom az adathoz (modell) és a felhasználói felülethez (nézet) tartozó dolgok szétválasztása, hogy a felhasználói felület ne befolyásolja az adatkezelést, és az adatok átszervezhetők legyenek a felhasználói felület változtatása nélkül. A modell-nézet-vezérlő ezt úgy éri el, hogy elkülöníti az adatok elérését és az üzleti logikát az adatok megjelenítésétől és a felhasználói interakciótól egy közbülső összetevő, a vezérlő (controller) bevezetésével.
 -->

---

<div>
  <h1 style="color: white">SQLite3</h1>
</div>

Az SQLite önálló, kis méretű (kb. 500 KiB), C forrású programkönyvtárként (library) megvalósított ACID-kompatibilis relációs adatbázis-kezelő rendszer, illetve adatbázismotor. Forrás: <a href="https://hu.wikipedia.org/wiki/SQLite" target="_blank">Wikipédia</a><br>

Szóval mi is az SQLite3? (Érthetően)<br>
Az SQLite3 egy könnyűsúlyú adatbázis-kezelő rendszer. Ez azt jelenti, hogy nincs szükség külön szerverre, mert az egész adatbázis egyetlen fájlban tárolódik. A legtöbb programozási nyelv, köztük a Node.js és a Python, könnyen tud vele dolgozni.
<br>
<ul>Miért előnyös a használata?
  <li>Egyszerű használat – Nincs szükség bonyolult telepítésre vagy konfigurációra.</li>
  <li>Gyors – Kis méretű projektekhez és teszteléshez tökéletes.</li>
  <li>Nincs szükség szerverre – Az adatokat egy fájlban tárolja, így nem kell külön adatbázis-szervert futtatni.</li>
  <li>Platformfüggetlen – Bárhol működik (PC, mobil, IoT eszközök).</li>
  <li>ACID-kompatibilis – Az adatok konzisztenciája biztosított, ami azt jelenti, hogy megbízható tranzakciókat lehet vele végrehajtani.</li>
</ul>  

<div @click="$slidev.nav.next" class="text-center py-1">
  <p hover:bg="white op-10">SSR<carbon:arrow-right /></p>
</div>

<!-- 
ACID jelentése:
A – Atomicity (Atomi művelet)
Egy tranzakció vagy teljesen végrehajtódik, vagy egyáltalán nem.
Ha valami félbeszakad, az adatbázis nem maradhat „félig módosított” állapotban.
Példa: Ha egy banki átutalás során az összeg levonása sikerül, de a másik számlára nem érkezik meg, az adatbázis visszaáll az eredeti állapotra.
C – Consistency (Konzisztencia)
A tranzakció végrehajtása után az adatbázis érvényes és konzisztens állapotban marad.
Nem lehet érvénytelen vagy sérült adatot tárolni.
I – Isolation (Elszigeteltség)
Több tranzakció egymás mellett is futhat, de nem zavarhatják meg egymást.
Példa: Ha két ember egyszerre vásárol egy terméket, az adatbázis biztosítja, hogy csak az egyikük kapja meg, ha csak egy darab van raktáron.
D – Durability (Tartósság)
Ha egy tranzakció sikeresen végrehajtódik, az adat nem veszhet el még áramszünet vagy rendszerhiba esetén sem.
Miért fontos?
Az ACID tulajdonságok biztosítják, hogy az adatbázis megbízható és konzisztens marad, még akkor is, ha váratlan események történnek.
 -->

---

<div>
  <h1 style="color: white">SSR azaz Server-Side rendering</h1>
</div>

Az SSR (Server-Side Rendering, vagyis szerveroldali renderelés) egy technika, ahol a weboldal HTML kódja már a szerveren generálódik, és a böngésző egy teljesen előállított oldalt kap.<br>

<ul>Hogyan működik?
  <li>A felhasználó megnyit egy oldalt a böngészőben.</li>
  <li>A böngésző kérést küld a szervernek.</li>
  <li>A szerver összeállítja az oldal teljes HTML kódját (például adatbázisból lekért adatokkal).</li>
  <li>A böngésző megkapja az előre elkészített HTML-t, és megjeleníti az oldalt.</li>
</ul><br>

<img class="ml-55" src="./assets/img/ssr.jpg" alt="discord" width="50%"> 

<div @click="$slidev.nav.next" class="text-center py-1">
  <p hover:bg="white op-10">A program<carbon:arrow-right /></p>
</div>

<!-- 
Miért előnyös az SSR?
✅ Gyorsabb első betöltés – A felhasználók azonnal látják az oldalt, nem kell megvárni, hogy a JavaScript minden tartalmat betöltögessen.
✅ Jobb SEO (Keresőoptimalizálás) – A keresőmotorok könnyebben beolvassák a szerver által előállított HTML-t, mert az oldal tartalma azonnal elérhető.
✅ Jobb teljesítmény gyengébb eszközökön – Mivel a szerver végzi a számításokat, a böngészőnek kevesebb dolga van.
Mikor érdemes használni?

🔹 Ha SEO-barát weboldalt szeretnél (pl. blogok, híroldalak).
🔹 Ha a felhasználók gyorsan kell, hogy lássák az oldalt.
🔹 Ha sok dinamikus adatot kell megjeleníteni, de mégis gyorsan kell betölteni az oldalt.
SSR vs CSR (Client-Side Rendering)

    SSR: A szerver készíti el a HTML-t → Gyorsabb első betöltés, jobb SEO.
    CSR: A böngésző generálja a HTML-t (pl. React, Vue SPA-k) → Lassabb első betöltés, de gördülékenyebb interakciók. -->

---

<div>
  <h1 style="color: white">Let's LOG!</h1>
</div><br>

Most, hogy megismerkedtünk a discord botok világával, tudjuk mi az a MVC minta itt az ideje, hogy gyakorlatban is kipróbáljuk a tanultakat!

Töltsük le a programot, és használjuk, nézzük át a kódot és a hozzá tartozó dokumentációt, és értelmezzük!

A program forráskódja letölhető a GitHub-ról:<br>
https://github.com/szankdav/SVSimulator-chatbot

A readme.md fájl tartalmazza a szükséges lépéseket és információkat a futtatáshoz!

A program részletes dokumentációja a docs mappában elérhető!

<div class="mt-20">
Köszönöm, hogy velem tanultál!
</div>

