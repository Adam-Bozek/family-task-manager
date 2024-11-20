Index.js inicializuje React aplikáciu s využitím rôznych knižníc a komponentov. Tu je podrobný rozpis kódu Index.js:

---

## 1. `ReactDOM.createRoot(document.getElementById("root"))`
- Vytvorí koreňový uzol React aplikácie.
- **`document.getElementById("root")`**: Nájde v HTML element s ID `root`, kde bude React aplikácia vložená.

---

## 2. `root.render(...)`
- Spúšťa **renderovanie aplikácie** do vytvoreného koreňového uzla.
- Renderovanie prekladá React kód do HTML a JavaScriptu, ktorý sa zobrazí na stránke.

---

## 3. `<React.StrictMode>`
- Obaluje aplikáciu v **režime prísnej kontroly**.
- Pomáha identifikovať:
  - Potenciálne problémy v kóde.
  - Zastaralé alebo nevhodné praktiky.
- Aktivuje sa iba počas vývoja, nie v produkcii.

---

## 4. `<BrowserRouter>`
- **Zabezpečuje routing** v aplikácii:
  - Umožňuje navigáciu medzi rôznymi stránkami/URL bez opätovného načítania celej stránky.
- Súčasť knižnice `react-router-dom`.

---

## 5. `<AppProvider>`
- Vlastný komponent definovaný v `./components/utilities/AppContext`.
- Poskytuje **kontext** pre celú aplikáciu:
  - Napríklad zdieľanie stavu (napr. používateľské údaje, témy, nastavenia) medzi komponentmi.
- Využíva Reactovú funkciu `createContext`.

---

## 6. `<App />`
- Hlavný komponent aplikácie:
  - Obsahuje všetku logiku, podkomponenty a UI aplikácie.
- Definovaný v súbore `./App`.

---

## 7. `import "bootstrap-icons/font/bootstrap-icons.css";`
- Importuje CSS súbor s ikonami Bootstrap Icons.
- Umožňuje používať ikony.

App.js definuje routing (navigáciu) v aplikácii pomocou knižnice `react-router-dom`. Obsahuje verejné aj chránené cesty, ktoré sú prístupné iba pre špecifické role používateľov (napr. rodič, dieťa, nový používateľ). 

---

## Hlavné prvky kódu

### Importované knižnice a komponenty
- **`React`**: Hlavná knižnica pre vytváranie React komponentov.
- **`Routes` a `Route`**: Poskytujú mechanizmus pre definovanie rôznych URL ciest v aplikácii.
- **`Navigate`**: Používa sa na presmerovanie používateľov pri neplatných URL.
- **`ProtectedRoute`**: Vlastný komponent, ktorý chráni určité cesty a kontroluje prístup na základe roly používateľa.

---

### Verejné komponenty (Public Routes)
- **`Home`**: Komponent zobrazený na domovskej stránke (`/Home`).
- **`MoreInfo`**: Poskytuje dodatočné informácie na ceste `/MoreInfo`.
- **`LoginPage`**: Stránka pre prihlásenie na ceste `/LogIn`.
- **`RegistrationPage`**: Stránka pre registráciu na ceste `/Register`.

---

### Chránené komponenty (Protected Routes)
Prístupné len po splnení určitých podmienok, napr. prihlásenie alebo konkrétna rola.

#### Pre nových používateľov:
- **`AfterRegistration`**: Prístupné iba pre používateľov s rolou `"after-reg"` na ceste `/AfterRegistration`.

#### Pre rodičov:
- **`ParentDashboardTasks`**: Zobrazuje úlohy pre rodičov na ceste `/ParentDashboardTasks`.
- **`ParentDashboardRewards`**: Prehľad odmien na ceste `/ParentDashboardRewards`.
- **`ParentSettings`**: Nastavenia rodiča na ceste `/ParentSettings`.
- **`ParentAddTask`**: Umožňuje rodičom pridávať úlohy na ceste `/ParentTasks`.

#### Pre deti:
- **`KidDashboard`**: Dashboard pre deti na ceste `/KidDashboard`.

---

### Testovací komponent
- **`TEMPLATE`**: Slúži na testovanie dizajnu alebo funkcionalít. Prístupný na ceste `/test_template`.

---

### Presmerovanie (Catch-All Redirect)
- **`Route path="*"`**:
  - Zachytí všetky neexistujúce URL.
  - Presmeruje používateľa na `/Home`.

---

## Funkcie a logika

### `ProtectedRoute`
- Tento komponent kontroluje, či má používateľ povolenie na prístup k danej ceste.
- Overuje rolu používateľa pomocou `allowedRoles`.
- Ak používateľ nemá povolenie, môže byť presmerovaný na inú stránku (napr. login).

---

### `Routes`
- Obsahuje všetky definované `Route` komponenty.
- Definuje, ktoré komponenty sa majú vykresliť pre konkrétne URL.

---

### `Navigate`
- Používa sa na presmerovanie používateľov:
  - Napr. pri neplatných cestách sa presmerujú na `/Home`.

---

## Celková funkcia kódu
1. Umožňuje navigáciu medzi verejnými cestami ako `/Home`, `/LogIn`, alebo `/Register`.
2. Obsahuje chránené cesty pre rôzne roly používateľov (napr. rodič, dieťa).
3. Poskytuje centralizované riadenie prístupov a zabezpečenia cez `ProtectedRoute`.
4. Zabezpečuje, že všetky neplatné URL budú presmerované na domovskú stránku.
