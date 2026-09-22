const LANGUAGE_STORAGE_KEY = 'novastore_lang';
const DEFAULT_LANGUAGE = 'it';

const LOCALES = {
  it: 'it-IT',
  en: 'en-GB',
};

// Entries shaped as { one, other } are plural forms, selected with Intl.PluralRules from params.count
const TRANSLATIONS = {
  it: {
    'meta.title': 'NovaStore | Catalogo',
    'meta.description': 'NovaStore - Catalogo prodotti',

    'nav.label': 'Navigazione principale',
    'nav.searchLabel': 'Cerca prodotti',
    'nav.searchPlaceholder': 'Cerca prodotti, marchi e categorie...',
    'nav.switchToDarkTheme': 'Attiva tema scuro',
    'nav.switchToLightTheme': 'Attiva tema chiaro',
    'nav.switchLanguage': "Cambia lingua: passa all'inglese",
    'nav.cartLabel': { one: 'Carrello, {count} articolo', other: 'Carrello, {count} articoli' },

    'filters.title': 'Filtri',
    'filters.reset': 'Azzera filtri',
    'filters.categories': 'Categorie',
    'filters.allCategories': 'Tutte',
    'filters.loadingCategories': 'Caricamento categorie…',
    'filters.maxPrice': 'Prezzo massimo',
    'filters.priceUpTo': 'Fino a {price}',
    'filters.toggleLabel': { one: 'Filtri, {count} attivo', other: 'Filtri, {count} attivi' },
    'filters.close': 'Chiudi filtri',
    'filters.showResults': 'Mostra risultati',
    'filters.showResultsCount': { one: 'Mostra {count} risultato', other: 'Mostra {count} risultati' },

    'promo.label': 'Promozione',
    'promo.title': 'Nuovi Arrivi di Stagione',
    'promo.subtitle': 'Spedizione gratuita su tutti gli ordini',

    'catalog.title': 'Catalogo',
    'catalog.loading': 'Caricamento…',
    'catalog.productCount': { one: '{count} prodotto', other: '{count} prodotti' },
    'catalog.sortLabel': 'Ordina per',
    'catalog.sortDefault': 'Più popolari',
    'catalog.sortPriceAsc': 'Prezzo: crescente',
    'catalog.sortPriceDesc': 'Prezzo: decrescente',
    'catalog.sortRatingDesc': 'Migliori recensioni',
    'catalog.emptyTitle': 'Nessun prodotto trovato per i criteri selezionati',
    'catalog.emptyHint': 'Prova a modificare la ricerca, le categorie o il prezzo massimo.',
    'catalog.loadError': 'Impossibile caricare i prodotti. Riprova più tardi.',

    'product.ratingLabel': 'Valutazione:',
    'product.ratingOutOf': 'Valutazione {rating} su {max}',
    'product.add': 'Aggiungi',
    'product.addLabel': 'Aggiungi {title} al carrello',
    'product.added': 'Aggiunto!',

    'cart.title': 'Il tuo carrello',
    'cart.close': 'Chiudi carrello',
    'cart.emptyTitle': 'Il tuo carrello è vuoto',
    'cart.emptyHint': 'Scopri il catalogo e aggiungi i tuoi prodotti preferiti.',
    'cart.continueShopping': 'Torna allo shopping',
    'cart.total': 'Totale',
    'cart.checkout': 'Procedi al Checkout',
    'cart.remove': 'Rimuovi {title} dal carrello',
    'cart.decrease': 'Diminuisci quantità di {title}',
    'cart.increase': 'Aumenta quantità di {title}',
    'cart.quantity': 'Quantità',
    'cart.orderConfirmed': 'Grazie per il tuo ordine! Totale addebitato: {total}',

    'quickView.close': 'Chiudi dettaglio prodotto',
    'quickView.gallery': 'Galleria immagini',
    'quickView.showImage': 'Mostra immagine {index} di {total}',
    'quickView.byBrand': 'di',
    'quickView.reviewCount': { one: '{count} recensione', other: '{count} recensioni' },
    'quickView.reviewsTitle': 'Recensioni ({count})',
    'quickView.noReviews': 'Nessuna recensione per questo prodotto.',
    'quickView.outOfStock': 'Esaurito',
    'quickView.lowStock': { one: 'Ultimo pezzo disponibile', other: 'Ultimi {count} pezzi disponibili' },
    'quickView.inStock': 'Disponibile · {count} pezzi in magazzino',
    'quickView.quantity': 'Quantità',
    'quickView.decrease': 'Diminuisci quantità',
    'quickView.increase': 'Aumenta quantità',
    'quickView.addToCart': 'Aggiungi al Carrello',

    'toast.addedToCart': 'Articolo aggiunto al carrello!',

    'footer.tagline': 'Essenziali moderni, consegnati senza pensieri.',
    'footer.navLabel': 'Link utili',
    'footer.shipping': 'Spedizioni',
    'footer.credits': 'Realizzato con Vanilla JS e Tailwind CSS da',
    'footer.demoSection': 'Questa è una sezione dimostrativa',
  },

  en: {
    'meta.title': 'NovaStore | Catalog',
    'meta.description': 'NovaStore - Product catalog',

    'nav.label': 'Main navigation',
    'nav.searchLabel': 'Search products',
    'nav.searchPlaceholder': 'Search products, brands and categories...',
    'nav.switchToDarkTheme': 'Switch to dark theme',
    'nav.switchToLightTheme': 'Switch to light theme',
    'nav.switchLanguage': 'Change language: switch to Italian',
    'nav.cartLabel': { one: 'Cart, {count} item', other: 'Cart, {count} items' },

    'filters.title': 'Filters',
    'filters.reset': 'Reset filters',
    'filters.categories': 'Categories',
    'filters.allCategories': 'All',
    'filters.loadingCategories': 'Loading categories…',
    'filters.maxPrice': 'Max price',
    'filters.priceUpTo': 'Up to {price}',
    'filters.toggleLabel': 'Filters, {count} active',
    'filters.close': 'Close filters',
    'filters.showResults': 'Show results',
    'filters.showResultsCount': { one: 'Show {count} result', other: 'Show {count} results' },

    'promo.label': 'Promotion',
    'promo.title': 'New Season Arrivals',
    'promo.subtitle': 'Free shipping on all orders',

    'catalog.title': 'Catalog',
    'catalog.loading': 'Loading…',
    'catalog.productCount': { one: '{count} product', other: '{count} products' },
    'catalog.sortLabel': 'Sort by',
    'catalog.sortDefault': 'Most popular',
    'catalog.sortPriceAsc': 'Price: Low to High',
    'catalog.sortPriceDesc': 'Price: High to Low',
    'catalog.sortRatingDesc': 'Top rated',
    'catalog.emptyTitle': 'No products match the selected criteria',
    'catalog.emptyHint': 'Try changing the search, the categories or the max price.',
    'catalog.loadError': 'Unable to load products. Please try again later.',

    'product.ratingLabel': 'Rating:',
    'product.ratingOutOf': 'Rated {rating} out of {max}',
    'product.add': 'Add to Cart',
    'product.addLabel': 'Add {title} to cart',
    'product.added': 'Added!',

    'cart.title': 'Your cart',
    'cart.close': 'Close cart',
    'cart.emptyTitle': 'Your cart is empty',
    'cart.emptyHint': 'Browse the catalog and add your favourite products.',
    'cart.continueShopping': 'Continue shopping',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove {title} from cart',
    'cart.decrease': 'Decrease quantity of {title}',
    'cart.increase': 'Increase quantity of {title}',
    'cart.quantity': 'Quantity',
    'cart.orderConfirmed': 'Thank you for your order! Total charged: {total}',

    'quickView.close': 'Close product details',
    'quickView.gallery': 'Image gallery',
    'quickView.showImage': 'Show image {index} of {total}',
    'quickView.byBrand': 'by',
    'quickView.reviewCount': { one: '{count} review', other: '{count} reviews' },
    'quickView.reviewsTitle': 'Reviews ({count})',
    'quickView.noReviews': 'No reviews for this product yet.',
    'quickView.outOfStock': 'Out of stock',
    'quickView.lowStock': { one: 'Only 1 left in stock', other: 'Only {count} left in stock' },
    'quickView.inStock': 'In stock · {count} available',
    'quickView.quantity': 'Quantity',
    'quickView.decrease': 'Decrease quantity',
    'quickView.increase': 'Increase quantity',
    'quickView.addToCart': 'Add to Cart',

    'toast.addedToCart': 'Item added to cart!',

    'footer.tagline': 'Modern essentials, seamlessly delivered.',
    'footer.navLabel': 'Quick links',
    'footer.shipping': 'Shipping',
    'footer.credits': 'Built with Vanilla JS & Tailwind CSS by',
    'footer.demoSection': 'This is a demo section',
  },
};

const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);

const languageListeners = new Set();

const loadStoredLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

const saveLanguage = (language) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Unable to save the language preference.', error);
  }
};

let currentLanguage = loadStoredLanguage();

export const getLanguage = () => currentLanguage;

export const getLocale = () => LOCALES[currentLanguage];

const interpolate = (template, params) =>
  template.replace(/\{(\w+)\}/g, (placeholder, paramName) => String(params[paramName] ?? placeholder));

const selectPluralForm = (pluralForms, count) => {
  const pluralCategory = new Intl.PluralRules(getLocale()).select(count);
  return pluralForms[pluralCategory] ?? pluralForms.other;
};

export const t = (key, params = {}) => {
  const entry = TRANSLATIONS[currentLanguage][key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key];

  if (entry === undefined) {
    console.warn(`Missing translation for key "${key}"`);
    return key;
  }

  const template = typeof entry === 'object' ? selectPluralForm(entry, params.count) : entry;
  return interpolate(template, params);
};

export const subscribeToLanguage = (listener) => {
  languageListeners.add(listener);
  return () => languageListeners.delete(listener);
};

export const toggleLanguage = () => {
  currentLanguage = currentLanguage === 'it' ? 'en' : 'it';
  saveLanguage(currentLanguage);
  languageListeners.forEach((listener) => listener(currentLanguage));
};
