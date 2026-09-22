<div align="center">

# 🛍️ NovaStore — High-Performance Vanilla JS E-Commerce

**Applicazione e-commerce modulare, performante e reattiva sviluppata in Vanilla JavaScript (ES6+), Tailwind CSS e Vite, senza framework esterni.**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![DummyJSON API](https://img.shields.io/badge/API-DummyJSON-4F46E5?style=flat-square&logo=json&logoColor=white)
![Conventional Commits](https://img.shields.io/badge/Conventional_Commits-1.0.0-FE5196?style=flat-square&logo=conventionalcommits&logoColor=white)

</div>

---

## 🔗 Demo Live & Repository

> 🚀 **Live Demo:** [In fase di rilascio su Vercel](https://novastore-catalog-app.vercel.app) *(deploy pianificato)*

[📦 GitHub Repository](https://github.com/zarradevp/novastore-catalog-app)

---

## ✨ Funzionalità Chiave (Key Features)

- ⚡ **Architettura Vanilla JS pura:** rendering rapido, zero overhead da framework e manipolazione diretta del DOM.
- 🔍 **Filtri e Ricerca Combinati:** ricerca in tempo reale, selezione categorie multiple, slider dinamico del prezzo massimo e ordinamento per popolarità, prezzo e rating.
- 📱 **Mobile-First UX & Drawers:** sidebar desktop permanente, drawer a scomparsa per i filtri su mobile e carrello slide-over reattivo.
- 🛒 **Carrello con Persistenza:** gestione completa dello stato carrello con sincronizzazione automatica in `localStorage` (anche tra più schede aperte).
- 👁️ **Quick View Modal:** finestra modale con scheda dettagliata del prodotto, galleria immagini, disponibilità in magazzino e recensioni con rating a stelle.
- 🌍 **Internazionalizzazione (i18n):** toggle dinamico Italiano / Inglese con formattazione automatica di valute, decimali e date secondo le convenzioni locali (`Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`).
- 🌗 **Dark / Light Theme:** toggle fluido con rilevamento delle preferenze di sistema e persistenza in `localStorage`, senza flash del tema sbagliato al caricamento.
- 🔔 **Toast Notification System:** notifiche non invasive per le azioni del carrello e per i link dimostrativi del footer.
- ♿ **Accessibilità:** HTML5 semantico, focus gestito negli overlay (Esc, click sul backdrop, ritorno del focus), sfondo `inert` durante drawer e modal ed etichette ARIA tradotte.

---

## 🧰 Tech Stack

| Livello | Tecnologia | Ruolo |
| --- | --- | --- |
| Linguaggio | **Vanilla JavaScript (ES6+)** | Moduli ES, logica applicativa e rendering del DOM |
| Build tool | **Vite** | Dev server con HMR e bundle di produzione ottimizzato |
| Styling | **Tailwind CSS** | Utility-first, dark mode `selector`, palette brand su CSS custom properties |
| CSS pipeline | **PostCSS + Autoprefixer** | Elaborazione di Tailwind e prefissi vendor |
| Dati | **DummyJSON REST API** | Catalogo prodotti reale (immagini, rating, stock, recensioni) |

---

## 🗂️ Struttura del Progetto

```text
novastore-catalog-app/
├── public/
│   ├── favicon.svg                # Logo del brand (shopping bag con gradiente)
│   └── product-placeholder.svg    # Fallback per le immagini non disponibili
├── src/
│   ├── main.js                    # Entry point: importa e collega i moduli
│   ├── api.js                     # Fetch dei prodotti da DummyJSON
│   ├── cart.js                    # Stato del carrello, pub/sub e persistenza
│   ├── filters.js                 # Filtri, ordinamento e conteggio filtri attivi
│   ├── i18n.js                    # Dizionario IT/EN, t() con plurali e lingua salvata
│   ├── theme.js                   # Tema chiaro/scuro e preferenze di sistema
│   ├── style.css                  # Direttive Tailwind, variabili e componenti
│   ├── utils/
│   │   └── format.js              # Formatter Intl per prezzi, rating e date; escapeHtml
│   └── ui/                        # Rendering dei componenti ed eventi UI
│       ├── overlay.js             # Controller condiviso per drawer e modal
│       ├── product-grid.js        # Card prodotto, skeleton, stati vuoto ed errore
│       ├── filters-panel.js       # Categorie e slider prezzo
│       ├── filter-drawer.js       # Sidebar desktop / drawer mobile dei filtri
│       ├── cart-drawer.js         # Carrello slide-over
│       ├── quick-view-modal.js    # Scheda prodotto con galleria e recensioni
│       ├── toast.js               # Notifiche toast
│       └── ...                    # Badge, toggle tema/lingua, footer, rating, fallback
├── index.html                     # Markup semantico dell'applicazione
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🏗️ Ingegnerizzazione e Best Practice

- **Codice modulare separato per responsabilità:** logica dati (`api.js`, `filters.js`), stato (`cart.js`, `theme.js`, `i18n.js`) e rendering (`src/ui/`) vivono in moduli distinti; `main.js` si limita a orchestrare. Funzioni piccole, a singola responsabilità e con nomi descrittivi.
- **Prevenzione XSS:** i testi dinamici vengono aggiornati tramite `.textContent`; dove il markup è generato da template, ogni dato proveniente dall'API passa da `escapeHtml()` prima di essere inserito, senza concatenazioni insicure.
- **Stato reattivo senza framework:** il carrello usa un semplice pattern publish/subscribe, così badge, drawer e toast si aggiornano da un'unica fonte di verità.
- **Robustezza:** chiamate di rete e accesso a `localStorage` sono protetti da `try/catch`; i dati salvati vengono validati prima dell'uso e le immagini non disponibili hanno un fallback.
- **Performance percepita:** skeleton loader durante il caricamento, event delegation sulla griglia, formatter `Intl` riutilizzati tramite cache e transizioni disattivate al primo paint per evitare glitch visivi.
- **Cronologia pulita:** ogni modifica è tracciata con [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`).

---

## 🚀 Installazione e Avvio Locale (Getting Started)

**Prerequisiti:** [Node.js](https://nodejs.org/) 20.19+ o 22.12+ e npm.

```bash
git clone https://github.com/zarradevp/novastore-catalog-app.git
cd novastore-catalog-app
npm install
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

| Script | Descrizione |
| --- | --- |
| `npm run dev` | Avvia il dev server con hot reload |
| `npm run build` | Genera la build di produzione in `dist/` |
| `npm run preview` | Serve in locale la build di produzione |

---

## 👤 Autore & Licenza

Progetto curato da [**zarradevp**](https://github.com/zarradevp).

Distribuito con licenza **MIT**: consulta il file [LICENSE](LICENSE) per i dettagli.
