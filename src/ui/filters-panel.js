import { t } from '../i18n.js';
import { escapeHtml, formatCategory, formatWholePrice } from '../utils/format.js';

const ALL_CATEGORIES_VALUE = 'all';

const createCategoryOption = ({ value, label, translationKey, isChecked }) => `
  <li>
    <label class="flex cursor-pointer items-center gap-2 capitalize">
      <input
        type="checkbox"
        name="category"
        value="${escapeHtml(value)}"
        class="h-4 w-4 rounded accent-brand"
        ${isChecked ? 'checked' : ''}
      />
      <span ${translationKey ? `data-i18n="${translationKey}"` : ''}>${escapeHtml(label)}</span>
    </label>
  </li>
`;

export const renderCategoryOptions = (categoryListElement, categories) => {
  const allCategoriesOption = {
    value: ALL_CATEGORIES_VALUE,
    label: t('filters.allCategories'),
    translationKey: 'filters.allCategories',
    isChecked: true,
  };
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: formatCategory(category),
    isChecked: false,
  }));

  categoryListElement.innerHTML = [allCategoriesOption, ...categoryOptions].map(createCategoryOption).join('');
};

// The "all" option is mutually exclusive with specific categories and re-checks itself when none are selected
export const syncCategoryCheckboxes = (categoryListElement, changedCheckbox) => {
  const allCategoriesCheckbox = categoryListElement.querySelector(`input[value="${ALL_CATEGORIES_VALUE}"]`);
  const specificCategoryCheckboxes = [
    ...categoryListElement.querySelectorAll(`input[name="category"]:not([value="${ALL_CATEGORIES_VALUE}"])`),
  ];

  if (changedCheckbox === allCategoriesCheckbox) {
    specificCategoryCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    allCategoriesCheckbox.checked = true;
    return;
  }

  allCategoriesCheckbox.checked = !specificCategoryCheckboxes.some((checkbox) => checkbox.checked);
};

export const resetCategorySelection = (categoryListElement) => {
  categoryListElement.querySelectorAll('input[name="category"]').forEach((checkbox) => {
    checkbox.checked = checkbox.value === ALL_CATEGORIES_VALUE;
  });
};

export const resetPriceRangeToMax = (rangeInput) => {
  rangeInput.value = rangeInput.max;
};

export const getSelectedCategories = (categoryListElement) =>
  [...categoryListElement.querySelectorAll('input[name="category"]:checked')]
    .map((checkbox) => checkbox.value)
    .filter((value) => value !== ALL_CATEGORIES_VALUE);

export const configurePriceRange = ({ rangeInput, minLabel, maxLabel }, { minPrice, maxPrice }) => {
  rangeInput.min = minPrice;
  rangeInput.max = maxPrice;
  rangeInput.value = maxPrice;
  rangeInput.disabled = false;
  updatePriceBoundLabels({ rangeInput, minLabel, maxLabel });
};

export const updatePriceBoundLabels = ({ rangeInput, minLabel, maxLabel }) => {
  minLabel.textContent = formatWholePrice(Number(rangeInput.min));
  maxLabel.textContent = formatWholePrice(Number(rangeInput.max));
};

export const updateSelectedPriceLabel = (rangeInput, valueLabel) => {
  const formattedPrice = formatWholePrice(Number(rangeInput.value));

  valueLabel.textContent = formattedPrice;
  rangeInput.setAttribute('aria-valuetext', t('filters.priceUpTo', { price: formattedPrice }));
};
