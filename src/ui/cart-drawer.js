import { t } from '../i18n.js';
import { escapeHtml, formatPrice } from '../utils/format.js';
import { createOverlayController } from './overlay.js';

const TRASH_ICON = `
  <svg class="h-4 w-4 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const QUANTITY_BUTTON_CLASSES =
  'flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100';

const createCartItem = ({ id, title, price, thumbnail, quantity }) => {
  const safeTitle = escapeHtml(title);

  return `
    <li class="cart-item flex gap-4 py-4" data-id="${Number(id)}">
      <img src="${escapeHtml(thumbnail)}" alt="" class="h-20 w-20 shrink-0 rounded-xl bg-slate-100 object-contain p-2 dark:bg-slate-800" />
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex items-start justify-between gap-2">
          <h3 class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100" title="${safeTitle}">${safeTitle}</h3>
          <button
            type="button"
            class="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
            data-cart-action="remove"
            aria-label="${escapeHtml(t('cart.remove', { title }))}"
          >
            ${TRASH_ICON}
          </button>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">${formatPrice(price)}</p>
        <div class="mt-auto flex items-center justify-between pt-2">
          <div class="flex items-center rounded-full border border-slate-200 dark:border-slate-700">
            <button type="button" class="${QUANTITY_BUTTON_CLASSES}" data-cart-action="decrease" aria-label="${escapeHtml(t('cart.decrease', { title }))}">−</button>
            <span class="w-8 text-center text-sm font-semibold" aria-label="${escapeHtml(t('cart.quantity'))}">${quantity}</span>
            <button type="button" class="${QUANTITY_BUTTON_CLASSES}" data-cart-action="increase" aria-label="${escapeHtml(t('cart.increase', { title }))}">+</button>
          </div>
          <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">${formatPrice(price * quantity)}</span>
        </div>
      </div>
    </li>
  `;
};

const createEmptyCartMarkup = () => `
  <div class="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
    <svg class="h-16 w-16 shrink-0 text-slate-300 dark:text-slate-700" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="10" cy="20.5" r="1.3" />
      <circle cx="18" cy="20.5" r="1.3" />
    </svg>
    <p class="font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(t('cart.emptyTitle'))}</p>
    <p class="text-sm text-slate-500 dark:text-slate-400">${escapeHtml(t('cart.emptyHint'))}</p>
    <button type="button" class="mt-2 rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark" data-overlay-close>
      ${escapeHtml(t('cart.continueShopping'))}
    </button>
  </div>
`;

export const createCartDrawer = ({
  drawerElement,
  itemsElement,
  footerElement,
  totalElement,
  checkoutButton,
  closeButton,
  triggerButton,
  backgroundRegions,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) => {
  const overlay = createOverlayController({
    overlayElement: drawerElement,
    backgroundRegions,
    initialFocusElement: closeButton,
    onStateChange: (isOpen) => triggerButton.setAttribute('aria-expanded', String(isOpen)),
  });

  // Re-rendering replaces the buttons, so keyboard focus is moved back to the equivalent control
  const restoreItemFocus = (focusedAction, focusedItemId) => {
    const equivalentButton = itemsElement.querySelector(
      `[data-id="${focusedItemId}"] [data-cart-action="${focusedAction}"]`,
    );

    (equivalentButton ?? closeButton).focus();
  };

  const render = (items, total) => {
    const focusedActionButton = itemsElement.contains(document.activeElement)
      ? document.activeElement.closest('[data-cart-action]')
      : null;
    const focusedItemId = focusedActionButton?.closest('[data-id]')?.dataset.id;

    const isEmpty = items.length === 0;
    itemsElement.innerHTML = isEmpty
      ? createEmptyCartMarkup()
      : `<ul class="divide-y divide-slate-100 dark:divide-slate-800">${items.map(createCartItem).join('')}</ul>`;

    footerElement.hidden = isEmpty;
    totalElement.textContent = formatPrice(total);

    if (focusedActionButton && overlay.isOpen()) {
      restoreItemFocus(focusedActionButton.dataset.cartAction, focusedItemId);
    }
  };

  const handleItemAction = (actionButton) => {
    const productId = Number(actionButton.closest('[data-id]').dataset.id);
    const actionHandlers = { increase: onIncrease, decrease: onDecrease, remove: onRemove };

    actionHandlers[actionButton.dataset.cartAction]?.(productId);
  };

  itemsElement.addEventListener('click', ({ target }) => {
    const actionButton = target.closest('[data-cart-action]');

    if (actionButton) {
      handleItemAction(actionButton);
    }
  });

  triggerButton.addEventListener('click', () => overlay.open(triggerButton));
  checkoutButton.addEventListener('click', onCheckout);

  return { open: () => overlay.open(triggerButton), close: overlay.close, render };
};
