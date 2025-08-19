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
      // Optimistic update: update UI immediately so header counter increments instantly
      const prevCart = cart || { items: [] };
      const currentCart = JSON.parse(JSON.stringify(prevCart));
      const existingItemIndex = currentCart.items.findIndex(
        (item) => item.product_id === productId
      );

      let optimisticCart;
      if (existingItemIndex >= 0) {
        optimisticCart = {
          ...currentCart,
          items: currentCart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: (item.quantity || 1) + quantity }
              : item
          ),
        };
      } else {
        optimisticCart = {
          ...currentCart,
          items: [
            ...currentCart.items,
            {
              id: `temp-${Date.now()}`,
              product_id: productId,
              quantity,
              // minimal placeholder product so the cart UI can render immediately
              product: { id: productId },
            },
          ],
        };
      }

      try {
        // Apply optimistic state
        setCart(optimisticCart);
        localStorage.setItem("cart", JSON.stringify(optimisticCart));

        // Call API to add to cart
        const data = await addToCart(productId, quantity, token);

        // Try to resync canonical cart from server. If that fails, keep optimistic state.
        try {
          const serverCart = await getCart(token);
          if (serverCart) {
            setCart(serverCart);
            localStorage.setItem("cart", JSON.stringify(serverCart));
          }
        } catch (syncErr) {
          // If we can't fetch server cart, attempt to merge returned product data into optimistic entry
          try {
            const merged = JSON.parse(JSON.stringify(optimisticCart));
            // find the temp item we added and attach returned product data if available
            const tempIdx = merged.items.findIndex(
              (it) =>
                it.product_id === productId && String(it.id).startsWith("temp-")
            );
            if (tempIdx >= 0 && data) {
              merged.items[tempIdx].product = data;
            }
            setCart(merged);
            localStorage.setItem("cart", JSON.stringify(merged));
          } catch (mergeErr) {
            // ignore merge errors
            console.error("Error merging optimistic cart:", mergeErr);
          }
        }

        return data;
      } catch (error) {
        // rollback optimistic change
        setCart(prevCart);
        localStorage.setItem("cart", JSON.stringify(prevCart));
        console.error("Error adding to cart:", error);
        throw error;
      }
    },
    [token, cart]
  );

  // Remove from cart
  const handleRemoveFromCart = useCallback(
    async (itemId) => {
      try {
        await removeFromCart(itemId, token);
        const updated = await getCart(token);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        return true;
      } catch (error) {
        console.error("Error removing from cart:", error);
        // Optionally, keep the existing cart state and surface the error to the UI
        return false;
      }
    },
    [token]
  );

  // Update cart item
  const handleUpdateCartItem = useCallback(
    async (itemId, quantity) => {
      try {
        await updateCartItem(itemId, quantity, token);
        const updated = await getCart(token);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        return true;
      } catch (error) {
        console.error("Error updating cart item:", error);
        return false;
      }
    },
    [token]
  );

  // Clear cart (local) — used after successful order fulfillment
  const clearCart = useCallback(() => {
    try {
      const empty = { items: [] };
      setCart(empty);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(empty));
      return true;
    } catch (e) {
      console.error("Error clearing cart:", e);
      return false;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateCartItem: handleUpdateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
