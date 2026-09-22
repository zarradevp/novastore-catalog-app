import { t } from '../i18n.js';
import { escapeHtml, formatRating } from '../utils/format.js';

const MAX_STARS = 5;

export const createStarIcon = (colorClass = 'text-amber-400') => `
  <svg class="h-4 w-4 shrink-0 ${colorClass}" width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
  </svg>
`;

export const createStarRating = (rating) => {
  const filledStars = Math.round(rating);
  const stars = Array.from({ length: MAX_STARS }, (_, index) =>
    createStarIcon(index < filledStars ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'),
  ).join('');

  return `
    <span class="flex items-center gap-0.5">
      ${stars}
      <span class="sr-only">${escapeHtml(t('product.ratingOutOf', { rating: formatRating(rating), max: MAX_STARS }))}</span>
    </span>
  `;
};
