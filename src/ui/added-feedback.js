import { t } from '../i18n.js';

const ADDED_FEEDBACK_DURATION_MS = 1200;

const feedbackResetTimers = new WeakMap();

export const showAddedFeedback = (button) => {
  clearTimeout(feedbackResetTimers.get(button));

  if (!button.dataset.added) {
    button.dataset.originalLabel = button.textContent.trim();
  }

  button.dataset.added = 'true';
  button.textContent = t('product.added');

  const resetTimer = setTimeout(() => {
    button.textContent = button.dataset.originalLabel;
    delete button.dataset.added;
  }, ADDED_FEEDBACK_DURATION_MS);

  feedbackResetTimers.set(button, resetTimer);
};
