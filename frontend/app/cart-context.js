"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../lib/cart";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children, token }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage and then from API
  useEffect(() => {
    const local = localStorage.getItem("cart");
    if (local) {
      try {
        setCart(JSON.parse(local));
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
      }
    }

    getCart(token)
      .then((data) => {
        setCart(data);
        localStorage.setItem("cart", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        // Set empty cart if API fails
        setCart({ items: [] });
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Add to cart and update local state
  const handleAddToCart = useCallback(
    async (productId, quantity) => {
      try {
        const data = await addToCart(productId, quantity, token);
        // For now, just add to local state since we don't have GET /cart endpoint yet
        const currentCart = cart || { items: [] };
        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.product_id === productId
        );

        let updatedCart;
        if (existingItemIndex >= 0) {
          updatedCart = {
            ...currentCart,
            items: currentCart.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        } else {
          updatedCart = {
            ...currentCart,
            items: [
              ...currentCart.items,
              {
                id: `temp-${Date.now()}`,
                product_id: productId,
                quantity,
                product: data, // The API returns the product data
              },
            ],
          };
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return data;
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
    },
    [token, cart]
  );

  // Remove from cart
  const handleRemoveFromCart = useCallback(
    async (itemId) => {
      await removeFromCart(itemId, token);
      const updated = await getCart(token);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    },
    [token]
  );

  // Update cart item
  const handleUpdateCartItem = useCallback(
    async (itemId, quantity) => {
      await updateCartItem(itemId, quantity, token);
      const updated = await getCart(token);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    },
    [token]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateCartItem: handleUpdateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
