import { getLanguage, t, toggleLanguage } from '../i18n.js';

export const updateLanguageToggle = (toggleButton) => {
  toggleButton.setAttribute('aria-label', t('nav.switchLanguage'));
  toggleButton.querySelectorAll('[data-language-option]').forEach((option) => {
    option.dataset.active = String(option.dataset.languageOption === getLanguage());
  });
};

export const initializeLanguageToggle = (toggleButton) => {
  updateLanguageToggle(toggleButton);
  toggleButton.addEventListener('click', toggleLanguage);
};
