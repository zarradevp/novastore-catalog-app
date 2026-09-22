const OVERLAY_TRANSITION_MS = 300;

export const createOverlayController = ({ overlayElement, backgroundRegions, initialFocusElement, onStateChange }) => {
  let focusReturnTarget = null;
  let hideAfterTransitionTimer = null;

  const isOpen = () => overlayElement.dataset.state === 'open';

  // Making the rest of the page inert keeps Tab focus and screen readers inside the open overlay
  const setOpenState = (shouldOpen) => {
    overlayElement.dataset.state = shouldOpen ? 'open' : 'closed';
    overlayElement.inert = !shouldOpen;
    backgroundRegions.forEach((region) => {
      region.inert = shouldOpen;
    });
    document.body.classList.toggle('overflow-hidden', shouldOpen);
    onStateChange?.(shouldOpen);
  };

  // The overlay stays [hidden] while closed so it can never render or animate before CSS loads.
  // Reading offsetHeight forces a reflow that commits the closed styles, so the opening transition runs.
  const revealOverlay = () => {
    clearTimeout(hideAfterTransitionTimer);
    overlayElement.hidden = false;
    void overlayElement.offsetHeight;
  };

  const hideOverlayAfterTransition = () => {
    hideAfterTransitionTimer = setTimeout(() => {
      overlayElement.hidden = true;
    }, OVERLAY_TRANSITION_MS);
  };

  const open = (elementToFocusOnClose = document.activeElement) => {
    focusReturnTarget = elementToFocusOnClose;
    revealOverlay();
    setOpenState(true);
    initialFocusElement.focus();
  };

  const close = () => {
    if (!isOpen()) {
      return;
    }

    setOpenState(false);
    hideOverlayAfterTransition();

    if (focusReturnTarget?.isConnected) {
      focusReturnTarget.focus();
    }
  };

  overlayElement.addEventListener('click', ({ target }) => {
    if (target.closest('[data-overlay-close]')) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      close();
    }
  });

  return { open, close, isOpen };
};
