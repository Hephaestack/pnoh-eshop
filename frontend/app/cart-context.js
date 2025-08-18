import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../lib/cart';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children, token }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage and then from API
  useEffect(() => {
    const local = localStorage.getItem('cart');
    if (local) setCart(JSON.parse(local));
    getCart(token)
      .then((data) => {
        setCart(data);
        localStorage.setItem('cart', JSON.stringify(data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  // Add to cart and update local state
  const handleAddToCart = useCallback(async (productId, quantity) => {
    const data = await addToCart(productId, quantity, token);
    const updated = await getCart(token);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    return data;
  }, [token]);

  // Remove from cart
  const handleRemoveFromCart = useCallback(async (itemId) => {
    await removeFromCart(itemId, token);
    const updated = await getCart(token);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }, [token]);

  // Update cart item
  const handleUpdateCartItem = useCallback(async (itemId, quantity) => {
    await updateCartItem(itemId, quantity, token);
    const updated = await getCart(token);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart, updateCartItem: handleUpdateCartItem }}>
      {children}
    </CartContext.Provider>
  );
}
