const FALLBACK_IMAGE_URL = '/product-placeholder.svg';

// Image 'error' events don't bubble, so one capture-phase listener on the container covers every image
const replaceBrokenImage = ({ target }) => {
  const isBrokenImage = target instanceof HTMLImageElement && !target.src.endsWith(FALLBACK_IMAGE_URL);

  if (isBrokenImage) {
    target.src = FALLBACK_IMAGE_URL;
  }
};

export const enableImageFallback = (containerElement) => {
  containerElement.addEventListener('error', replaceBrokenImage, true);
};
