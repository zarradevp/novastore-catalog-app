const PRODUCT_COMPARATORS = {
  'price-asc': (firstProduct, secondProduct) => firstProduct.price - secondProduct.price,
  'price-desc': (firstProduct, secondProduct) => secondProduct.price - firstProduct.price,
  'rating-desc': (firstProduct, secondProduct) => secondProduct.rating - firstProduct.rating,
};

export const getUniqueCategories = (products) => [...new Set(products.map(({ category }) => category))].sort();

export const getPriceBounds = (products) => {
  if (products.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const prices = products.map(({ price }) => price);

  return {
    minPrice: Math.floor(Math.min(...prices)),
    maxPrice: Math.ceil(Math.max(...prices)),
  };
};

const matchesSearchQuery = ({ title, description }, normalizedQuery) =>
  normalizedQuery === '' || `${title} ${description}`.toLowerCase().includes(normalizedQuery);

const matchesSelectedCategories = ({ category }, selectedCategories) =>
  selectedCategories.length === 0 || selectedCategories.includes(category);

const matchesMaxPrice = ({ price }, maxPrice) => price <= maxPrice;

export const countActiveFilters = ({ selectedCategories, maxPrice }, priceCeiling) =>
  selectedCategories.length + (maxPrice < priceCeiling ? 1 : 0);

export const filterAndSortProducts = (products, { searchQuery, selectedCategories, maxPrice, sortOption }) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchingProducts = products.filter(
    (product) =>
      matchesSearchQuery(product, normalizedQuery) &&
      matchesSelectedCategories(product, selectedCategories) &&
      matchesMaxPrice(product, maxPrice),
  );

  const comparator = PRODUCT_COMPARATORS[sortOption];
  return comparator ? matchingProducts.toSorted(comparator) : matchingProducts;
};
