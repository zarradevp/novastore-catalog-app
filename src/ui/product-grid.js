import { t } from '../i18n.js';
import { escapeHtml, formatCategory, formatPrice, formatRating } from '../utils/format.js';
import { createStarIcon } from './star-rating.js';

const SKELETON_FILL = 'bg-slate-200 dark:bg-slate-800';

const createSkeletonCard = () => `
  <div class="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
    <div class="aspect-[4/3] ${SKELETON_FILL}"></div>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="h-4 w-20 rounded-full ${SKELETON_FILL}"></div>
      <div class="h-4 w-3/4 rounded ${SKELETON_FILL}"></div>
      <div class="h-3 w-12 rounded ${SKELETON_FILL}"></div>
      <div class="mt-auto flex items-center justify-between pt-3">
        <div class="h-6 w-20 rounded ${SKELETON_FILL}"></div>
        <div class="h-8 w-24 rounded-full ${SKELETON_FILL}"></div>
      </div>
    </div>
  </div>
`;

// The title button's ::after overlay covers the whole card, making it clickable and keyboard accessible;
// the add button sits above it with z-10 so it keeps its own action
const createProductCard = ({ id, title, category, rating, price, thumbnail }) => {
  const safeTitle = escapeHtml(title);

  return `
    <article class="product-card relative focus-within:ring-2 focus-within:ring-brand/40">
      <div class="aspect-[4/3] bg-slate-100 dark:bg-slate-800">
        <img src="${escapeHtml(thumbnail)}" alt="${safeTitle}" loading="lazy" class="h-full w-full object-contain p-4" />
      </div>
      <div class="flex flex-1 flex-col gap-2 p-4">
        <span class="w-fit rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium capitalize text-brand-dark dark:bg-brand/20 dark:text-brand-light">
          ${escapeHtml(formatCategory(category))}
        </span>
        <h3 class="font-semibold text-slate-900 dark:text-slate-100">
          <button
            type="button"
            class="block w-full truncate text-left focus:outline-none after:absolute after:inset-0 after:content-['']"
            data-action="open-quick-view"
            data-id="${Number(id)}"
            title="${safeTitle}"
          >
            ${safeTitle}
          </button>
        </h3>
        <p class="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          ${createStarIcon()}
          <span class="sr-only">${escapeHtml(t('product.ratingLabel'))}</span>
          ${formatRating(rating)}
        </p>
        <div class="mt-auto flex items-center justify-between pt-3">
          <span class="text-lg font-bold text-brand dark:text-brand-bright">${formatPrice(price)}</span>
          <button
            type="button"
            class="relative z-10 min-w-[6.5rem] rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 data-[added=true]:bg-emerald-600"
            data-action="add-to-cart"
            data-id="${Number(id)}"
            aria-label="${escapeHtml(t('product.addLabel', { title }))}"
          >
            ${escapeHtml(t('product.add'))}
          </button>
        </div>
      </div>
    </article>
  `;
};

export const renderProductSkeletons = (gridElement, skeletonCount) => {
  gridElement.setAttribute('aria-busy', 'true');
  gridElement.innerHTML = Array.from({ length: skeletonCount }, createSkeletonCard).join('');
};

export const renderProductGrid = (gridElement, products) => {
  gridElement.innerHTML = products.map(createProductCard).join('');
  gridElement.setAttribute('aria-busy', 'false');
};

export const renderNoProductsFound = (gridElement) => {
  gridElement.innerHTML = `
    <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <p class="font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(t('catalog.emptyTitle'))}</p>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${escapeHtml(t('catalog.emptyHint'))}</p>
      <button
        type="button"
        class="mt-5 rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        data-action="reset-filters"
      >
        ${escapeHtml(t('filters.reset'))}
      </button>
    </div>
  `;
  gridElement.setAttribute('aria-busy', 'false');
};

export const renderProductsError = (gridElement, message) => {
  gridElement.innerHTML = `
    <p role="alert" class="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
      ${escapeHtml(message)}
    </p>
  `;
  gridElement.setAttribute('aria-busy', 'false');
};
