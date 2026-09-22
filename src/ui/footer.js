export const renderCurrentYear = (yearElement) => {
  yearElement.textContent = String(new Date().getFullYear());
};

export const bindDemoLinks = (linksContainer, onDemoLinkClick) => {
  linksContainer.addEventListener('click', (event) => {
    if (event.target.closest('[data-demo-link]')) {
      event.preventDefault();
      onDemoLinkClick();
    }
  });
};
