const THEME_STORAGE_KEY = 'novastore_theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

const systemDarkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === DARK_THEME || storedTheme === LIGHT_THEME ? storedTheme : null;
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Impossibile salvare la preferenza del tema.', error);
  }
};

const getSystemTheme = () => (systemDarkModeQuery.matches ? DARK_THEME : LIGHT_THEME);

const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === DARK_THEME);
};

export const isDarkThemeActive = () => document.documentElement.classList.contains('dark');

export const toggleTheme = () => {
  const nextTheme = isDarkThemeActive() ? LIGHT_THEME : DARK_THEME;

  applyTheme(nextTheme);
  saveTheme(nextTheme);
};

export const initializeTheme = ({ onSystemThemeChange } = {}) => {
  applyTheme(getStoredTheme() ?? getSystemTheme());

  // The OS preference is followed live only until the user picks a theme explicitly
  systemDarkModeQuery.addEventListener('change', () => {
    if (!getStoredTheme()) {
      applyTheme(getSystemTheme());
      onSystemThemeChange?.();
    }
  });
};
