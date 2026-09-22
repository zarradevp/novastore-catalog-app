import { escapeHtml } from '../utils/format.js';

const TOAST_DURATION_MS = 2500;
const TOAST_TRANSITION_MS = 300;
const MAX_VISIBLE_TOASTS = 3;

const TOAST_ICONS = {
  success: `
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
      <svg class="h-4 w-4 shrink-0 text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  `,
  info: `
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand">
      <svg class="h-4 w-4 shrink-0 text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
        <path d="M12 11v6M12 7h.01" stroke-linecap="round" />
      </svg>
    </span>
  `,
};

const createToastElement = (message, description, variant) => {
  const toastElement = document.createElement('div');

  toastElement.className =
    'toast pointer-events-auto flex w-80 max-w-[calc(100vw-2.5rem)] translate-y-4 items-center gap-3 rounded-2xl bg-slate-900/90 px-4 py-3 text-white opacity-0 shadow-xl ring-1 ring-white/10 backdrop-blur dark:bg-slate-800/95 dark:text-slate-100 dark:shadow-black/40 dark:ring-slate-700 transition duration-300 ease-out data-[state=visible]:translate-y-0 data-[state=visible]:opacity-100 motion-reduce:transition-none';
  toastElement.innerHTML = `
    ${TOAST_ICONS[variant] ?? TOAST_ICONS.success}
    <div class="min-w-0">
      <p class="text-sm font-semibold">${escapeHtml(message)}</p>
      ${description ? `<p class="truncate text-xs text-slate-300">${escapeHtml(description)}</p>` : ''}
    </div>
  `;

  return toastElement;
};

const dismissToast = (toastElement) => {
  if (toastElement.dataset.dismissing) {
    return;
  }

  toastElement.dataset.dismissing = 'true';
  delete toastElement.dataset.state;
  setTimeout(() => toastElement.remove(), TOAST_TRANSITION_MS);
};

export const showToast = (message, { description, variant = 'success' } = {}) => {
  const toastRegion = document.querySelector('#toast-region');
  const toastElement = createToastElement(message, description, variant);

  const activeToasts = toastRegion.querySelectorAll('.toast:not([data-dismissing])');
  if (activeToasts.length >= MAX_VISIBLE_TOASTS) {
    dismissToast(activeToasts[0]);
  }

  toastRegion.append(toastElement);

  // A double requestAnimationFrame guarantees the hidden state is painted first, so the entrance transition runs
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!toastElement.dataset.dismissing) {
        toastElement.dataset.state = 'visible';
      }
    });
  });

  setTimeout(() => dismissToast(toastElement), TOAST_DURATION_MS);
};
