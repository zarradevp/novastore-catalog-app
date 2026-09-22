import { t } from '../i18n.js';
import { isDarkThemeActive, toggleTheme } from '../theme.js';

export const updateThemeToggleLabel = (toggleButton) => {
  toggleButton.setAttribute('aria-label', t(isDarkThemeActive() ? 'nav.switchToLightTheme' : 'nav.switchToDarkTheme'));
};

export const initializeThemeToggle = (toggleButton) => {
  updateThemeToggleLabel(toggleButton);

  toggleButton.addEventListener('click', () => {
    toggleTheme();
    updateThemeToggleLabel(toggleButton);
  });
};
