"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  mergeCart,
} from "../lib/cart";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children, token, tokenLoaded = true }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set()); // Track specific items being removed
  const [previousToken, setPreviousToken] = useState(token);
  const [skipCartFetch, setSkipCartFetch] = useState(false);
  const [mergedThisLogin, setMergedThisLogin] = useState(false);
  const [awaitingMerge, setAwaitingMerge] = useState(false);
  const mergedRef = useRef(mergedThisLogin);

  // keep a ref in sync so async wait loops can observe updates (avoids closure
  // capturing stale `mergedThisLogin` value)
  useEffect(() => {
    mergedRef.current = mergedThisLogin;
  }, [mergedThisLogin]);

  // Load cart from localStorage and then from API
  useEffect(() => {
    if (skipCartFetch) {
      setSkipCartFetch(false);
      return;
    }

    // Load local cart immediately so UI renders quickly. Prefer a preloaded
    // cart (set by auth flows) to avoid any visible flash after login.
    let local = null;
    try {
      // If a recent merge completed in another window, prefer the server cart
      try {
        const mergedFlag = typeof window !== 'undefined' && localStorage.getItem('cart_merged');
        if (mergedFlag) {
          // clear the flag so we don't repeat this logic
          try { localStorage.removeItem('cart_merged'); } catch (e) {}
          // ensure we don't pre-populate from localStorage
          local = null;
        }
      } catch (e) {
        // ignore localStorage failures
      }
      const preloaded = typeof window !== 'undefined' && window.__preloadedCart;
      const preloadedLS = localStorage.getItem('cart_preloaded');
      if (preloaded) {
        setCart(preloaded);
        local = JSON.stringify(preloaded);
        // mark that we've merged/loaded preloaded cart to prevent further fetches
        setMergedThisLogin(true);
        setSkipCartFetch(true);
      } else if (preloadedLS) {
        const parsed = JSON.parse(preloadedLS);
        setCart(parsed);
        local = JSON.stringify(parsed);
        setMergedThisLogin(true);
        setSkipCartFetch(true);
        // clear the ephemeral storage key
        try { localStorage.removeItem('cart_preloaded'); } catch(e){}
      } else {
        const ls = localStorage.getItem("cart");
        if (ls) {
          setCart(JSON.parse(ls));
          local = ls;
        }
      }
    } catch (e) {
      // Error reading preloaded/local cart:
    }

    const loadCartFromApi = async () => {
      try {
        // Check if we need to merge carts (user just logged in)
        const hadGuestCart = local && JSON.parse(local)?.items?.length > 0;
        const isNewLogin = !previousToken && token;

        // Skip automatic cart merge to prevent 401 errors
        if (isNewLogin && hadGuestCart) {
          // mark that we're going to wait for merge before doing any GET /cart
          setAwaitingMerge(true);
          // If token has been resolved, perform an automatic merge here to ensure
          // we don't miss merging when auth flows didn't trigger it. We guard
          // with mergedThisLogin to avoid duplicate merges.
          if (tokenLoaded && token && !mergedThisLogin) {
            try {
              // Auto-merging guest cart in CartProvider...
              const merged = await handleMergeCart(token);
              // Refresh canonical cart after merge
              try {
                const data = await getCart(token);
                if (data) {
                  setCart(data);
                  localStorage.setItem("cart", JSON.stringify(data));
                }
              } catch (fetchErr) {
                // Failed to fetch cart after auto-merge:
              }
              setMergedThisLogin(true);
              setPreviousToken(token);
              setLoading(false);
              setAwaitingMerge(false);
              return;
            } catch (mergeErr) {
              // Auto-merge failed:
              // allow fallback to regular fetch below
            }
          } else {
            // New login detected with guest cart, but deferring automatic merge until token is ready
          }
        }

        // If we previously detected a new login with guest cart and did not
        // complete the merge, wait briefly for the merge to finish (or timeout)
        if (awaitingMerge && !mergedThisLogin) {
          // wait up to 3s for mergedThisLogin to become true
          // Use mergedRef to avoid stale closure capture; extend timeout to 5s
          const waitForMerge = () =>
            new Promise((resolve) => {
              const start = Date.now();
              const interval = setInterval(() => {
                if (mergedRef.current) {
                  clearInterval(interval);
                  resolve(true);
                } else if (Date.now() - start > 5000) {
                  clearInterval(interval);
                  resolve(false);
                }
              }, 100);
            });

          try {
            const ok = await waitForMerge();
          } catch (e) {
            // Error while waiting for merge:
          }
          setAwaitingMerge(false);
        }

        // Only fetch from API once we've resolved token availability
        if (tokenLoaded) {
          if (token) {
            const data = await getCart(token);
            // Only overwrite local cart if the server returned a valid cart
            if (data && data.items) {
              setCart(data);
              localStorage.setItem("cart", JSON.stringify(data));
            } else {
              // Server returned empty/invalid cart, preserving local cart until canonical cart is available
            }
          } else {
            // Keep existing local cart to avoid a visible empty flash
            const preserved = local ? JSON.parse(local) : { items: [] };
            setCart(preserved);
          }
          setPreviousToken(token);
        } else {
          // Token not yet resolved; keep local cart and wait for tokenLoaded to flip
          // Token not loaded yet, deferring API cart fetch
        }
      } catch (error) {
        // Error fetching cart:
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCartFromApi();
  }, [token, previousToken, skipCartFetch, tokenLoaded]);

  // Add to cart and update local state
  const handleAddToCart = useCallback(
    async (productId, quantity) => {
      // Prevent multiple concurrent additions
      if (isAddingToCart) {
        console.log('🚫 Already adding to cart, ignoring request');
        return;
      }

      setIsAddingToCart(true);
      
      try {
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
          }
        }

        return data;
      } catch (error) {
        // rollback optimistic change
        const prevCart = cart || { items: [] };
        setCart(prevCart);
        localStorage.setItem("cart", JSON.stringify(prevCart));
        // Error adding to cart:
        throw error;
      } finally {
        // Reset loading state quickly for better UX
        setTimeout(() => {
          setIsAddingToCart(false);
        }, 400); // Much faster for quick item adding
      }
    },
    [token, cart, isAddingToCart]
  );

  // Remove from cart
  const handleRemoveFromCart = useCallback(
    async (itemId) => {
      const id = String(itemId);
      
      // Prevent concurrent removal of the same item
      if (removingItems.has(id)) {
        console.log('🚫 Already removing this item, ignoring request');
        return false;
      }

      // Add this item to the removing set
      setRemovingItems(prev => new Set([...prev, id]));

      try {
        // Call API to remove FIRST - no optimistic removal
        const ok = await removeFromCart(itemId, token);

        if (!ok) {
          console.log('Failed to remove item from server');
          return false;
        }

        // Only update UI after successful server removal
        const prevCart = cart || { items: [] };
        const currentCart = JSON.parse(JSON.stringify(prevCart));
        const idx = currentCart.items.findIndex(
          (it) => (it.product && String(it.product.id) === String(id)) || String(it.product_id) === String(id) || String(it.id) === String(id)
        );

        if (idx !== -1) {
          const updatedCart = {
            ...currentCart,
            items: currentCart.items.filter((_, i) => i !== idx),
          };
          setCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }

        return true;
      } catch (error) {
        console.error('Error removing item from cart:', error);
        return false;
      } finally {
        // Remove this item from the removing set after a delay
        setTimeout(() => {
          setRemovingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }, 300); // Small delay to show completion
      }
    },
    [token, cart, removingItems]
  );

  // Helper function to check if an item is being removed
  const isItemBeingRemoved = useCallback((itemId) => {
    return removingItems.has(String(itemId));
  }, [removingItems]);

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
        // Error updating cart item:
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
      // Error clearing cart:
      return false;
    }
  }, []);

  // Merge guest cart with user cart after login
  const handleMergeCart = useCallback(async (overrideToken) => {
    const useToken = overrideToken || token;
    if (!useToken || typeof useToken !== 'string' || useToken.trim() === '') {
      return null;
    }
    // mark that a merge is in-flight so the loading effect can wait for it
    try {
      setAwaitingMerge(true);
      try {
      const mergedCart = await mergeCart(useToken);
      setCart(mergedCart);
      localStorage.setItem("cart", JSON.stringify(mergedCart));
        setSkipCartFetch(true); // Prevent next effect from overwriting merged cart
        // mark merged so waiting loops proceed
        setMergedThisLogin(true);
        setAwaitingMerge(false);
        return mergedCart;
    } catch (error) {
      // Check if it's an auth error
      // Don't throw - let the calling code handle the error gracefully
        setAwaitingMerge(false);
        return null;
    }
    } catch (e) {
      // fallback - ensure awaiting flag cleared
      setAwaitingMerge(false);
      throw e;
    }
  }, [token]);

  // Expose setCart globally for post-login merge/fetch flows
  if (typeof window !== 'undefined') {
    window.__setCart = setCart;
  }
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isAddingToCart,
        isItemBeingRemoved, // Helper to check if specific item is being removed
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateCartItem: handleUpdateCartItem,
        clearCart,
        mergeCart: handleMergeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
