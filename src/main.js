import './style.css';
import { fetchProducts } from './api.js';
import {
  addToCart,
  clearCart,
  getCartCount,
  getCartItems,
  getCartTotal,
  removeFromCart,
  subscribeToCart,
  updateQuantity,
} from './cart.js';
import { countActiveFilters, filterAndSortProducts, getPriceBounds, getUniqueCategories } from './filters.js';
import { subscribeToLanguage, t } from './i18n.js';
import { initializeTheme } from './theme.js';
import { formatPrice } from './utils/format.js';
import { updateCartBadge } from './ui/cart-badge.js';
import { createCartDrawer } from './ui/cart-drawer.js';
import { createFilterDrawer } from './ui/filter-drawer.js';
import { bindDemoLinks, renderCurrentYear } from './ui/footer.js';
import {
  configurePriceRange,
  getSelectedCategories,
  renderCategoryOptions,
  resetCategorySelection,
  resetPriceRangeToMax,
  syncCategoryCheckboxes,
  updatePriceBoundLabels,
  updateSelectedPriceLabel,
} from './ui/filters-panel.js';
import { showAddedFeedback } from './ui/added-feedback.js';
import { enableImageFallback } from './ui/image-fallback.js';
import { initializeLanguageToggle, updateLanguageToggle } from './ui/language-toggle.js';
import { translateStaticElements } from './ui/static-translations.js';
import {
  renderNoProductsFound,
  renderProductGrid,
  renderProductSkeletons,
  renderProductsError,
} from './ui/product-grid.js';
import { createQuickViewModal } from './ui/quick-view-modal.js';
import { initializeThemeToggle, updateThemeToggleLabel } from './ui/theme-toggle.js';
import { showToast } from './ui/toast.js';

const SKELETON_CARD_COUNT = 6;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.catalog');
const productsSection = document.querySelector('.products');
const pageFooter = document.querySelector('.site-footer');
const filterDrawerElement = document.querySelector('#filter-drawer');
const filterToggleButton = document.querySelector('#filter-toggle');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const themeToggleButton = document.querySelector('#theme-toggle');
const languageToggleButton = document.querySelector('#language-toggle');
const cartButton = document.querySelector('#cart-button');
const cartBadge = document.querySelector('#cart-count');
const resetFiltersButton = document.querySelector('#reset-filters-button');
const categoryList = document.querySelector('#category-list');
const priceRangeInput = document.querySelector('#price-range');
const priceValueLabel = document.querySelector('#price-value');
const priceMinLabel = document.querySelector('#price-min-label');
const priceMaxLabel = document.querySelector('#price-max-label');
const sortSelect = document.querySelector('#sort-select');
const productGrid = document.querySelector('#product-grid');
const productsCountLabel = document.querySelector('#products-count');
const cartDrawerElement = document.querySelector('#cart-drawer');
const cartItemsElement = document.querySelector('#cart-items');
const quickViewElement = document.querySelector('#quick-view');
const quickViewContent = document.querySelector('#quick-view-content');

let allProducts = [];
let catalogStatus = 'loading';

const findCartItemQuantity = (productId) =>
  getCartItems().find((item) => item.id === productId)?.quantity ?? 0;

const handleCheckout = () => {
  const orderTotal = formatPrice(getCartTotal());

  cartDrawer.close();
  clearCart();
  window.alert(t('cart.orderConfirmed', { total: orderTotal }));
};

const cartDrawer = createCartDrawer({
  drawerElement: cartDrawerElement,
  itemsElement: cartItemsElement,
  footerElement: document.querySelector('#cart-footer'),
  totalElement: document.querySelector('#cart-total'),
  checkoutButton: document.querySelector('#checkout-button'),
  closeButton: document.querySelector('#cart-close-button'),
  triggerButton: cartButton,
  backgroundRegions: [pageHeader, pageMain, pageFooter],
  onIncrease: (productId) => updateQuantity(productId, findCartItemQuantity(productId) + 1),
  onDecrease: (productId) => updateQuantity(productId, findCartItemQuantity(productId) - 1),
  onRemove: removeFromCart,
  onCheckout: handleCheckout,
});

const renderCart = (cartItems) => {
  cartDrawer.render(cartItems, getCartTotal());
  updateCartBadge({ badgeElement: cartBadge, cartButton }, getCartCount());
};

const addProductToCart = (product, quantity, triggerButton) => {
  addToCart(product, quantity);
  showAddedFeedback(triggerButton);
  showToast(t('toast.addedToCart'), {
    description: quantity === 1 ? product.title : `${quantity} × ${product.title}`,
  });
};

const quickViewModal = createQuickViewModal({
  modalElement: quickViewElement,
  panelElement: quickViewElement.querySelector('.quick-view__panel'),
  contentElement: quickViewContent,
  closeButton: document.querySelector('#quick-view-close-button'),
  backgroundRegions: [pageHeader, pageMain, pageFooter],
  onAddToCart: addProductToCart,
});

const filterDrawer = createFilterDrawer({
  drawerElement: filterDrawerElement,
  panelElement: filterDrawerElement.querySelector('.filter-panel'),
  closeButton: document.querySelector('#filter-close-button'),
  toggleButton: filterToggleButton,
  toggleCountBadge: document.querySelector('#filter-toggle-count'),
  showResultsButton: document.querySelector('#show-results-button'),
  backgroundRegions: [pageHeader, productsSection, pageFooter],
});

const findProductById = (productId) => allProducts.find(({ id }) => id === Number(productId));

const handleProductGridClick = ({ target }) => {
  const actionButton = target.closest('[data-action]');

  if (actionButton?.dataset.action === 'reset-filters') {
    resetFilters();
    // On mobile the sidebar reset button lives in the closed drawer, so focus lands on the drawer toggle instead
    (resetFiltersButton.offsetParent ? resetFiltersButton : filterToggleButton).focus();
    return;
  }

  const product = actionButton && findProductById(actionButton.dataset.id);

  if (!product) {
    return;
  }

  if (actionButton.dataset.action === 'add-to-cart') {
    addProductToCart(product, 1, actionButton);
  } else if (actionButton.dataset.action === 'open-quick-view') {
    quickViewModal.open(product, actionButton);
  }
};

const getFilterCriteria = () => ({
  searchQuery: searchInput.value,
  selectedCategories: getSelectedCategories(categoryList),
  maxPrice: Number(priceRangeInput.value),
  sortOption: sortSelect.value,
});

const applyFilters = () => {
  const filterCriteria = getFilterCriteria();
  const visibleProducts = filterAndSortProducts(allProducts, filterCriteria);

  if (visibleProducts.length === 0) {
    renderNoProductsFound(productGrid);
  } else {
    renderProductGrid(productGrid, visibleProducts);
  }

  productsCountLabel.textContent = t('catalog.productCount', { count: visibleProducts.length });
  filterDrawer.updateSummary({
    resultsCount: visibleProducts.length,
    activeFiltersCount: countActiveFilters(filterCriteria, Number(priceRangeInput.max)),
  });
};

const resetFilters = () => {
  searchInput.value = '';
  resetCategorySelection(categoryList);
  resetPriceRangeToMax(priceRangeInput);
  updateSelectedPriceLabel(priceRangeInput, priceValueLabel);
  sortSelect.value = 'default';
  applyFilters();
};

const initializeFilterControls = (products) => {
  renderCategoryOptions(categoryList, getUniqueCategories(products));
  configurePriceRange(
    { rangeInput: priceRangeInput, minLabel: priceMinLabel, maxLabel: priceMaxLabel },
    getPriceBounds(products),
  );
  updateSelectedPriceLabel(priceRangeInput, priceValueLabel);
  sortSelect.disabled = false;
  resetFiltersButton.disabled = false;
};

const handleCategoryChange = ({ target }) => {
  syncCategoryCheckboxes(categoryList, target);
  applyFilters();
};

const handlePriceRangeInput = () => {
  updateSelectedPriceLabel(priceRangeInput, priceValueLabel);
  applyFilters();
};

const bindFilterEvents = () => {
  searchInput.addEventListener('input', applyFilters);
  categoryList.addEventListener('change', handleCategoryChange);
  priceRangeInput.addEventListener('input', handlePriceRangeInput);
  sortSelect.addEventListener('change', applyFilters);
  resetFiltersButton.addEventListener('click', resetFilters);
};

const loadProducts = async () => {
  renderProductSkeletons(productGrid, SKELETON_CARD_COUNT);
  productsCountLabel.textContent = t('catalog.loading');

  try {
    allProducts = await fetchProducts();
    catalogStatus = 'ready';
    initializeFilterControls(allProducts);
    bindFilterEvents();
    applyFilters();
  } catch (error) {
    console.error(error);
    catalogStatus = 'error';
    renderProductsError(productGrid, t('catalog.loadError'));
    productsCountLabel.textContent = '';
    categoryList.innerHTML = '';
  }
};

const translateCatalog = () => {
  if (catalogStatus === 'loading') {
    productsCountLabel.textContent = t('catalog.loading');
  } else if (catalogStatus === 'error') {
    renderProductsError(productGrid, t('catalog.loadError'));
  } else {
    updatePriceBoundLabels({ rangeInput: priceRangeInput, minLabel: priceMinLabel, maxLabel: priceMaxLabel });
    updateSelectedPriceLabel(priceRangeInput, priceValueLabel);
    applyFilters();
  }
};

const handleLanguageChange = () => {
  translateStaticElements();
  updateLanguageToggle(languageToggleButton);
  updateThemeToggleLabel(themeToggleButton);
  renderCart(getCartItems());
  filterDrawer.refreshTranslations();
  translateCatalog();
};

translateStaticElements();
renderCurrentYear(document.querySelector('#footer-year'));
bindDemoLinks(pageFooter.querySelector('.site-footer__links'), () =>
  showToast(t('footer.demoSection'), { variant: 'info' }),
);

initializeTheme({ onSystemThemeChange: () => updateThemeToggleLabel(themeToggleButton) });
initializeThemeToggle(themeToggleButton);
initializeLanguageToggle(languageToggleButton);
subscribeToLanguage(handleLanguageChange);

enableImageFallback(productGrid);
enableImageFallback(cartItemsElement);
enableImageFallback(quickViewContent);
searchForm.addEventListener('submit', (event) => event.preventDefault());
productGrid.addEventListener('click', handleProductGridClick);

subscribeToCart(renderCart);
renderCart(getCartItems());

loadProducts();

// Two frames guarantee the first styled paint has happened before transitions are re-enabled
requestAnimationFrame(() => {
  requestAnimationFrame(() => document.documentElement.classList.remove('is-loading'));
});
