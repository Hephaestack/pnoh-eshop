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
          console.debug('Detected cart_merged flag in localStorage, forcing fetch from API');
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
      console.error('Error reading preloaded/local cart:', e);
    }

    const loadCartFromApi = async () => {
      try {
        // Check if we need to merge carts (user just logged in)
        const hadGuestCart = local && JSON.parse(local)?.items?.length > 0;
        const isNewLogin = !previousToken && token;

        console.log('Cart context loading:', { hadGuestCart, isNewLogin, previousToken, token, tokenLoaded });

        // Skip automatic cart merge to prevent 401 errors
        if (isNewLogin && hadGuestCart) {
          console.log('New login detected with guest cart');
          // mark that we're going to wait for merge before doing any GET /cart
          setAwaitingMerge(true);
          // If token has been resolved, perform an automatic merge here to ensure
          // we don't miss merging when auth flows didn't trigger it. We guard
          // with mergedThisLogin to avoid duplicate merges.
          if (tokenLoaded && token && !mergedThisLogin) {
            try {
              console.log('Auto-merging guest cart in CartProvider...');
              const merged = await handleMergeCart(token);
              console.debug('Auto-merge result:', merged);
              // Refresh canonical cart after merge
              try {
                const data = await getCart(token);
                if (data) {
                  setCart(data);
                  localStorage.setItem("cart", JSON.stringify(data));
                }
              } catch (fetchErr) {
                console.error('Failed to fetch cart after auto-merge:', fetchErr);
              }
              setMergedThisLogin(true);
              setPreviousToken(token);
              setLoading(false);
              setAwaitingMerge(false);
              return;
            } catch (mergeErr) {
              console.error('Auto-merge failed:', mergeErr);
              // allow fallback to regular fetch below
            }
          } else {
            console.log('New login detected with guest cart, but deferring automatic merge until token is ready');
          }
        }

        // If we previously detected a new login with guest cart and did not
        // complete the merge, wait briefly for the merge to finish (or timeout)
        if (awaitingMerge && !mergedThisLogin) {
          console.log('Awaiting merge completion before fetching canonical cart...');
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
            console.log('Waited for merge, success=', ok);
          } catch (e) {
            console.error('Error while waiting for merge:', e);
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
              console.log('Server returned empty/invalid cart, preserving local cart until canonical cart is available');
            }
          } else {
            // Keep existing local cart to avoid a visible empty flash
            const preserved = local ? JSON.parse(local) : { items: [] };
            setCart(preserved);
          }
          setPreviousToken(token);
        } else {
          // Token not yet resolved; keep local cart and wait for tokenLoaded to flip
          console.log('Token not loaded yet, deferring API cart fetch');
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
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
      // Optimistic removal: update UI immediately so user sees instant feedback
      const prevCart = cart || { items: [] };
      const currentCart = JSON.parse(JSON.stringify(prevCart));
      const id = itemId;
      const idx = currentCart.items.findIndex(
        (it) => (it.product && String(it.product.id) === String(id)) || String(it.product_id) === String(id) || String(it.id) === String(id)
      );

      if (idx === -1) {
        // nothing to remove client-side
        return false;
      }

      const optimistic = {
        ...currentCart,
        items: currentCart.items.filter((_, i) => i !== idx),
      };

      try {
        // Apply optimistic state
        setCart(optimistic);
        localStorage.setItem("cart", JSON.stringify(optimistic));

        // Call API to remove
        const ok = await removeFromCart(itemId, token);

        if (!ok) {
          // treat as failure and rollback
          setCart(prevCart);
          try { localStorage.setItem("cart", JSON.stringify(prevCart)); } catch (e) {}
          return false;
        }

        // Attempt to resync canonical cart from server; if it fails, keep optimistic state
        try {
          const updated = await getCart(token);
          if (updated) {
            setCart(updated);
            localStorage.setItem("cart", JSON.stringify(updated));
          }
        } catch (syncErr) {
          console.debug('Failed to fetch server cart after delete, keeping optimistic state', syncErr);
        }

        return true;
      } catch (error) {
        console.error("Error removing from cart:", error);
        // rollback optimistic change
        setCart(prevCart);
        try { localStorage.setItem("cart", JSON.stringify(prevCart)); } catch (e) {}
        return false;
      }
    },
    [token, cart]
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

  // Merge guest cart with user cart after login
  const handleMergeCart = useCallback(async (overrideToken) => {
    const useToken = overrideToken || token;
    if (!useToken || typeof useToken !== 'string' || useToken.trim() === '') {
      console.warn('Cannot merge cart: invalid or missing token');
      return null;
    }
    // mark that a merge is in-flight so the loading effect can wait for it
    try {
      setAwaitingMerge(true);
      console.log('Manual cart merge called with token:', useToken);
    try {
      const mergedCart = await mergeCart(useToken);
      console.log('Manual merge successful:', mergedCart);
      setCart(mergedCart);
      localStorage.setItem("cart", JSON.stringify(mergedCart));
        setSkipCartFetch(true); // Prevent next effect from overwriting merged cart
        // mark merged so waiting loops proceed
        setMergedThisLogin(true);
        setAwaitingMerge(false);
        return mergedCart;
    } catch (error) {
        console.error("Error merging cart:", error);
      // Check if it's an auth error
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.log('Authentication error during cart merge - token may not be ready');
      }
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
