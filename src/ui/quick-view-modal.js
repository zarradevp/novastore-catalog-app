import { t } from '../i18n.js';
import { escapeHtml, formatCategory, formatPrice, formatRating, formatReviewDate } from '../utils/format.js';
import { createOverlayController } from './overlay.js';
import { createStarRating } from './star-rating.js';

const LOW_STOCK_THRESHOLD = 10;

const QUANTITY_BUTTON_CLASSES =
  'flex h-11 w-11 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100';

const IMAGE_SURFACE_CLASSES = 'bg-slate-100 dark:bg-slate-800';

const getGalleryImages = ({ images, thumbnail }) => (images?.length ? images : [thumbnail]);

const createStockIndicator = (stock) => {
  if (stock === 0) {
    return `<p class="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400"><span class="h-2 w-2 rounded-full bg-red-500"></span>${escapeHtml(t('quickView.outOfStock'))}</p>`;
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return `<p class="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400"><span class="h-2 w-2 rounded-full bg-amber-500"></span>${escapeHtml(t('quickView.lowStock', { count: stock }))}</p>`;
  }

  return `<p class="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>${escapeHtml(t('quickView.inStock', { count: stock }))}</p>`;
};

const createGallery = (images, title) => {
  const thumbnails = images
    .map(
      (imageUrl, index) => `
        <li>
          <button
            type="button"
            class="h-16 w-16 overflow-hidden rounded-xl border-2 border-transparent ${IMAGE_SURFACE_CLASSES} p-1 transition hover:border-slate-300 aria-[current=true]:border-brand dark:hover:border-slate-600 dark:aria-[current=true]:border-brand-bright"
            data-gallery-index="${index}"
            aria-label="${escapeHtml(t('quickView.showImage', { index: index + 1, total: images.length }))}"
            aria-current="${index === 0}"
          >
            <img src="${escapeHtml(imageUrl)}" alt="" class="h-full w-full object-contain" />
          </button>
        </li>
      `,
    )
    .join('');

  return `
    <section aria-label="${escapeHtml(t('quickView.gallery'))}">
      <div class="aspect-square overflow-hidden rounded-2xl ${IMAGE_SURFACE_CLASSES}">
        <img src="${escapeHtml(images[0])}" alt="${escapeHtml(title)}" class="h-full w-full object-contain p-6" data-gallery-main />
      </div>
      ${images.length > 1 ? `<ul class="mt-4 flex flex-wrap gap-3">${thumbnails}</ul>` : ''}
    </section>
  `;
};

const createPurchaseControls = (stock, title) => {
  const isOutOfStock = stock === 0;

  return `
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <div class="flex items-center rounded-full border border-slate-200 dark:border-slate-700" role="group" aria-label="${escapeHtml(t('quickView.quantity'))}">
        <button type="button" class="${QUANTITY_BUTTON_CLASSES}" data-quantity-action="decrease" aria-label="${escapeHtml(t('quickView.decrease'))}" ${isOutOfStock ? 'disabled' : ''}>−</button>
        <output class="w-10 text-center font-semibold" data-quantity-value aria-live="polite">${isOutOfStock ? 0 : 1}</output>
        <button type="button" class="${QUANTITY_BUTTON_CLASSES}" data-quantity-action="increase" aria-label="${escapeHtml(t('quickView.increase'))}" ${isOutOfStock ? 'disabled' : ''}>+</button>
      </div>
      <button
        type="button"
        class="min-w-[12rem] flex-1 rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:bg-slate-300 data-[added=true]:bg-emerald-600 dark:disabled:bg-slate-700"
        data-action="quick-view-add"
        aria-label="${escapeHtml(t('product.addLabel', { title }))}"
        ${isOutOfStock ? 'disabled' : ''}
      >
        ${escapeHtml(t('quickView.addToCart'))}
      </button>
    </div>
  `;
};

const createReview = ({ rating, comment, date, reviewerName }) => `
  <li class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(reviewerName)}</p>
      <time class="text-xs text-slate-500 dark:text-slate-400" datetime="${escapeHtml(date)}">${formatReviewDate(date)}</time>
    </div>
    <div class="mt-1">${createStarRating(rating)}</div>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${escapeHtml(comment)}</p>
  </li>
`;

const createReviewsSection = (reviews = []) => `
  <section class="border-t border-slate-200 px-6 py-6 sm:px-8 dark:border-slate-800" aria-labelledby="quick-view-reviews-title">
    <h3 id="quick-view-reviews-title" class="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">${escapeHtml(t('quickView.reviewsTitle', { count: reviews.length }))}</h3>
    ${
      reviews.length > 0
        ? `<ul class="grid gap-3 sm:grid-cols-2">${reviews.map(createReview).join('')}</ul>`
        : `<p class="text-sm text-slate-500 dark:text-slate-400">${escapeHtml(t('quickView.noReviews'))}</p>`
    }
  </section>
`;

const createQuickViewMarkup = (product) => {
  const { title, brand, category, description, price, rating, stock, reviews = [] } = product;

  return `
    <div class="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
      ${createGallery(getGalleryImages(product), title)}

      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2 pr-10 text-sm">
          <span class="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium capitalize text-brand-dark dark:bg-brand/20 dark:text-brand-light">
            ${escapeHtml(formatCategory(category))}
          </span>
          ${brand ? `<span class="text-slate-500 dark:text-slate-400">${escapeHtml(t('quickView.byBrand'))} <strong class="font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(brand)}</strong></span>` : ''}
        </div>

        <h2 id="quick-view-title" class="text-2xl font-bold text-slate-900 dark:text-slate-100">${escapeHtml(title)}</h2>

        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          ${createStarRating(rating)}
          <span class="font-semibold text-slate-900 dark:text-slate-100" aria-hidden="true">${formatRating(rating)}</span>
          <span>(${escapeHtml(t('quickView.reviewCount', { count: reviews.length }))})</span>
        </div>

        <p class="text-3xl font-bold text-brand dark:text-brand-bright">${formatPrice(price)}</p>
        ${createStockIndicator(stock)}
        <p class="leading-relaxed text-slate-600 dark:text-slate-300">${escapeHtml(description)}</p>

        ${createPurchaseControls(stock, title)}
      </div>
    </div>

    ${createReviewsSection(reviews)}
  `;
};

export const createQuickViewModal = ({
  modalElement,
  panelElement,
  contentElement,
  closeButton,
  backgroundRegions,
  onAddToCart,
}) => {
  const overlay = createOverlayController({
    overlayElement: modalElement,
    backgroundRegions,
    initialFocusElement: closeButton,
  });

  let currentProduct = null;
  let selectedQuantity = 1;

  const updateQuantityControls = () => {
    contentElement.querySelector('[data-quantity-value]').textContent = selectedQuantity;
    contentElement.querySelector('[data-quantity-action="decrease"]').disabled = selectedQuantity <= 1;
    contentElement.querySelector('[data-quantity-action="increase"]').disabled = selectedQuantity >= currentProduct.stock;
  };

  const changeSelectedQuantity = (quantityDelta) => {
    selectedQuantity = Math.min(Math.max(selectedQuantity + quantityDelta, 1), currentProduct.stock);
    updateQuantityControls();
  };

  const selectGalleryImage = (imageIndex) => {
    contentElement.querySelector('[data-gallery-main]').src = getGalleryImages(currentProduct)[imageIndex];
    contentElement.querySelectorAll('[data-gallery-index]').forEach((thumbnailButton) => {
      thumbnailButton.setAttribute('aria-current', String(Number(thumbnailButton.dataset.galleryIndex) === imageIndex));
    });
  };

  const open = (product, elementToFocusOnClose) => {
    currentProduct = product;
    selectedQuantity = 1;
    contentElement.innerHTML = createQuickViewMarkup(product);
    panelElement.scrollTop = 0;

    if (product.stock > 0) {
      updateQuantityControls();
    }

    overlay.open(elementToFocusOnClose);
  };

  contentElement.addEventListener('click', ({ target }) => {
    const thumbnailButton = target.closest('[data-gallery-index]');
    const quantityButton = target.closest('[data-quantity-action]');
    const addButton = target.closest('[data-action="quick-view-add"]');

    if (thumbnailButton) {
      selectGalleryImage(Number(thumbnailButton.dataset.galleryIndex));
    } else if (quantityButton) {
      changeSelectedQuantity(quantityButton.dataset.quantityAction === 'increase' ? 1 : -1);
    } else if (addButton) {
      onAddToCart(currentProduct, selectedQuantity, addButton);
    }
  });

  return { open, close: overlay.close };
};
