import { t } from '../i18n.js';
import { createOverlayController } from './overlay.js';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export const createFilterDrawer = ({
  drawerElement,
  panelElement,
  closeButton,
  toggleButton,
  toggleCountBadge,
  showResultsButton,
  backgroundRegions,
}) => {
  const overlay = createOverlayController({
    overlayElement: drawerElement,
    backgroundRegions,
    initialFocusElement: closeButton,
    onStateChange: (isOpen) => toggleButton.setAttribute('aria-expanded', String(isOpen)),
  });
  const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  let summary = { resultsCount: null, activeFiltersCount: 0 };

  // The same panel is a static sidebar on desktop, where the overlay-only state (inert, hidden, dialog role) must not apply
  const applyResponsiveLayout = () => {
    const isDesktop = desktopMediaQuery.matches;

    if (isDesktop) {
      overlay.close();
    }

    drawerElement.inert = !isDesktop && !overlay.isOpen();
    panelElement.setAttribute('role', isDesktop ? 'complementary' : 'dialog');

    if (isDesktop) {
      panelElement.removeAttribute('aria-modal');
    } else {
      panelElement.setAttribute('aria-modal', 'true');
    }
  };

  const renderSummary = () => {
    const { resultsCount, activeFiltersCount } = summary;

    showResultsButton.textContent =
      resultsCount === null ? t('filters.showResults') : t('filters.showResultsCount', { count: resultsCount });
    toggleCountBadge.textContent = String(activeFiltersCount);
    toggleCountBadge.dataset.count = String(activeFiltersCount);
    toggleButton.setAttribute(
      'aria-label',
      activeFiltersCount > 0 ? t('filters.toggleLabel', { count: activeFiltersCount }) : t('filters.title'),
    );
  };

  const updateSummary = (nextSummary) => {
    summary = { ...summary, ...nextSummary };
    renderSummary();
  };

  toggleButton.addEventListener('click', () => overlay.open(toggleButton));
  desktopMediaQuery.addEventListener('change', applyResponsiveLayout);

  applyResponsiveLayout();
  renderSummary();

  return { updateSummary, refreshTranslations: renderSummary, close: overlay.close };
};
