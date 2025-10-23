# Portfolio Project - In Progress

Vítejte v repozitáři mého osobního portfolia. Tento projekt je vytvářen od nuly s cílem vybudovat mé dovednosti v moderním webovém vývoji.

---

21. října 2025

Dnes byl položen kompletní základ celého projektu. Z prázdné složky jsme se dostali na plně nastylovanou, responzivní statickou stránku.

### Co bylo dokončeno:

* **Nastavení prostředí:**
    * Instalace a konfigurace **Gitu** pro verzování.
    * Nastavení **VS Code** s klíčovými doplňky (Live Server, Prettier).
    * Propojení lokálního repozitáře s **GitHubem**.

* **Fáze 1: Struktura (HTML)**
    * Vytvořena základní sémantická kostra `index.html`.
    * Web byl rozdělen na logické sekce: `Home`, `Projects`, `About Me` a `Contact`.

* **Fáze 2: Vizuální podoba (CSS)**
    * Implementován globální "CSS reset" a nastaveno základní téma **"dark mode"**.
    * Vytvořena **přilepená navigace** (`position: fixed`) pomocí Flexboxu.
    * Navržena působivá "Hero" sekce (`#home`), která vyplní celou obrazovku.
    * Nastylována responzivní mřížka pro projekty (`#projects`) pomocí **CSS Grid** s interaktivními `:hover` efekty.
    * Vytvořen dvou-sloupcový layout pro sekci "About Me" (`#about`) pomocí **Flexboxu**.
    * Navržen a nastylován kompletní **kontaktní formulář** (`#contact`).

* **Opravy a Git:**
    * Veškerý postup byl průběžně ukládán pomocí `git commit` a `git push`.
    * Byly odladěny chyby v HTML struktuře a vyměněny nefunkční zástupné obrázky.

### Aktuální stav projektu:

Web je vizuálně kompletní. Každá sekce má svůj unikátní a moderní styl a celá stránka je responzivní. Jedná se o statický základ připravený na další fázi.

### Další kroky:

* **Fáze 3: Interaktivita (JavaScript)**
    * Začneme implementací plynulého (animovaného) skrolování po kliknutí na odkazy v navigaci.


# Portfolio Project - In Progress

Vítejte v repozitáři mého osobního portfolia. Tento projekt je vytvářen od nuly s cílem ukázat mé dovednosti v moderním webovém vývoji.

---

## Zpráva o postupu: 22. - 23. října 2025

Během posledních dvou dní jsme se zaměřili na **oživení** a **vizuální vylepšení** portfolia. I když jsme narazili na **značné technické problémy a frustraci** při ladění JavaScriptových animací, podařilo se nám dosáhnout stabilního a vylepšeného stavu.

### Dokončené úkoly:

* **Fáze 3: Interaktivita (JavaScript)**
    * Implementováno **plynulé skrolování** navigace.
    * Přidáno **automatické zvýraznění aktivní sekce** v navigaci (pomocí `IntersectionObserver`).
    * Zprovozněn **kontaktní formulář** z pohledu frontendu (zobrazení zprávy, vyčištění polí).
    * Obnovena a integrována původní, **funkční Canvas animace** (síť bodů s oranžovými čarami) v Hero sekci, po **mnoha neúspěšných pokusech** s alternativními Canvas efekty (galaxie, magic trails), které se nedařilo spolehlivě rozchodit.

* **Vizuální Vylepšení ("Wow" Efekt)**
    * Změněno barevné schéma: Původní barva byla nahrazena **oranžovými gradienty** pro živější vzhled.
    * Vylepšena typografie: Pro nadpisy byl přidán font **Poppins** z Google Fonts.
    * Implementace "scroll-in" animací byla **po dlouhém a frustrujícím ladění prozatím odstraněna**, jelikož `IntersectionObserver` i alternativní metoda pomocí `scroll` eventu způsobovaly problémy a nespolehlivě fungovaly. Kód byl vyčištěn, abychom zajistili stabilitu.

* **Ladění a Git:**
    * Strávili jsme **značný čas a úsilí** laděním JavaScriptu, bojem s cache prohlížeče a hledáním "tichých" chyb v kódu, což vedlo k **velké frustraci**.
    * Naučili jsme se řešit konflikty při `git push` a vrátit se ke starší verzi kódu (`git reset`).
    * Veškerý postup byl průběžně ukládán na GitHub.

### Aktuální stav projektu:

Máme **funkční, vizuálně vylepšenou a interaktivní** webovou stránku se stabilní Canvas animací. Klíčové JavaScriptové funkce (kromě scroll-in animací) běží. Web je **vyčištěný od nefunkčních částí** a připravený na **nasazení na internet**.

### Další kroky (příště):

* **Fáze 5: Nasazení (Deployment)**
    * Nahrajeme web zdarma na internet pomocí **GitHub Pages**.

I přes všechny překážky jsme se posunuli vpřed. Dobrá práce s výdrží!