import { getLanguage, t } from '../i18n.js';

const ATTRIBUTE_BINDINGS = [
  { selector: '[data-i18n-placeholder]', datasetKey: 'i18nPlaceholder', attribute: 'placeholder' },
  { selector: '[data-i18n-aria-label]', datasetKey: 'i18nAriaLabel', attribute: 'aria-label' },
  { selector: '[data-i18n-content]', datasetKey: 'i18nContent', attribute: 'content' },
];

export const translateStaticElements = (rootElement = document) => {
  document.documentElement.lang = getLanguage();

  rootElement.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  ATTRIBUTE_BINDINGS.forEach(({ selector, datasetKey, attribute }) => {
    rootElement.querySelectorAll(selector).forEach((element) => {
      element.setAttribute(attribute, t(element.dataset[datasetKey]));
    });
  });
};
