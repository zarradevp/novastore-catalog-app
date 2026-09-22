const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products?limit=24';

export const fetchProducts = async () => {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const { products } = await response.json();
    return products;
  } catch (error) {
    throw new Error('Failed to fetch products', { cause: error });
  }
};
