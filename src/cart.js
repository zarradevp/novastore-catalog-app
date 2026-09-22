const CART_STORAGE_KEY = 'novastore_cart';

const cartListeners = new Set();

const isValidCartItem = (item) =>
  Number.isInteger(item?.id) &&
  typeof item.title === 'string' &&
  Number.isFinite(item.price) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0;

const loadCartFromStorage = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    return Array.isArray(storedCart) ? storedCart.filter(isValidCartItem) : [];
  } catch (error) {
    console.warn('Carrello salvato non leggibile, verrà reimpostato.', error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Impossibile salvare il carrello.', error);
  }
};

let cartItems = loadCartFromStorage();

export const getCartItems = () => cartItems.map((item) => ({ ...item }));

const notifyCartListeners = () => {
  const itemsSnapshot = getCartItems();
  cartListeners.forEach((listener) => listener(itemsSnapshot));
};

const commitCart = (nextItems) => {
  cartItems = nextItems;
  saveCartToStorage(cartItems);
  notifyCartListeners();
};

export const subscribeToCart = (listener) => {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
};

export const addToCart = ({ id, title, price, thumbnail }, quantityToAdd = 1) => {
  const isAlreadyInCart = cartItems.some((item) => item.id === id);

  const nextItems = isAlreadyInCart
    ? cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + quantityToAdd } : item))
    : [...cartItems, { id, title, price, thumbnail, quantity: quantityToAdd }];

  commitCart(nextItems);
};

export const removeFromCart = (productId) => {
  commitCart(cartItems.filter((item) => item.id !== productId));
};

export const updateQuantity = (productId, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  commitCart(cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
};

export const clearCart = () => {
  commitCart([]);
};

// Rounded to cents to avoid floating-point drift (e.g. 0.1 + 0.2)
export const getCartTotal = () =>
  Math.round(cartItems.reduce((total, { price, quantity }) => total + price * quantity, 0) * 100) / 100;

export const getCartCount = () => cartItems.reduce((count, { quantity }) => count + quantity, 0);

// Keeps multiple open tabs in sync: 'storage' only fires in tabs other than the one that wrote
window.addEventListener('storage', ({ key }) => {
  if (key === CART_STORAGE_KEY) {
    cartItems = loadCartFromStorage();
    notifyCartListeners();
  }
});
