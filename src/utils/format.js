import { getLocale } from '../i18n.js';

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const formatterCache = new Map();

// Intl formatters are costly to build, so one instance per formatter type and locale is reused
const getFormatter = (formatterName, createFormatter) => {
  const locale = getLocale();
  const cacheKey = `${formatterName}:${locale}`;

  if (!formatterCache.has(cacheKey)) {
    formatterCache.set(cacheKey, createFormatter(locale));
  }

  return formatterCache.get(cacheKey);
};

export const formatPrice = (amount) =>
  getFormatter('price', (locale) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })).format(amount);

export const formatWholePrice = (amount) =>
  getFormatter(
    'wholePrice',
    (locale) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
  ).format(amount);

export const formatRating = (rating) =>
  getFormatter(
    'rating',
    (locale) => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  ).format(rating);

export const formatReviewDate = (isoDate) =>
  getFormatter(
    'reviewDate',
    (locale) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
  ).format(new Date(isoDate));

export const formatCategory = (category) => category.replaceAll('-', ' ');

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character]);
