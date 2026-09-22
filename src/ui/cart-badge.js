import { t } from '../i18n.js';

const MAX_DISPLAYED_COUNT = 99;

export const updateCartBadge = ({ badgeElement, cartButton }, itemCount) => {
  badgeElement.textContent = itemCount > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : String(itemCount);
  cartButton.setAttribute('aria-label', t('nav.cartLabel', { count: itemCount }));
};
