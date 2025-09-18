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
  const [removingItems, setRemovingItems] = useState(new Set());
  const [previousToken, setPreviousToken] = useState(token);
  const skipCartFetchRef = useRef(false);
  const [mergedThisLogin, setMergedThisLogin] = useState(false);
  const [awaitingMerge, setAwaitingMerge] = useState(false);
  const mergedRef = useRef(mergedThisLogin);
  const cartRef = useRef(cart);

  const handleMergeCart = useCallback(async (overrideToken) => {
    const useToken = overrideToken || token;
    if (!useToken || typeof useToken !== 'string' || useToken.trim() === '') return null;
    try {
      setAwaitingMerge(true);
      const mergedCart = await mergeCart(useToken);
      if (mergedCart) {
        setCart(mergedCart);
        try { localStorage.setItem('cart', JSON.stringify(mergedCart)); } catch (e) {}
        skipCartFetchRef.current = true;
        setMergedThisLogin(true);
        setAwaitingMerge(false);
        return mergedCart;
      }
      setAwaitingMerge(false);
      return null;
    } catch (error) {
      console.error('Cart merge failed:', error);
      setAwaitingMerge(false);
      return null;
    }
  }, [token]);

  useEffect(() => {
    mergedRef.current = mergedThisLogin;
  }, [mergedThisLogin]);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    // When user signs out (previousToken existed but token is now falsy)
    // do NOT immediately clear the cart or localStorage. Clearing here
    // causes a visible flash of "Your cart is empty" before navigation
    // completes. Instead preserve the client-side/local cart and let
    // the normal loader logic (which reads `localStorage`) restore
    // the guest cart state. We still reset merge-related flags.
    if (previousToken && !token) {
      // preserve local cart; mark that we are no longer merged for this session
      setMergedThisLogin(false);
      setAwaitingMerge(false);
      // ensure loading is false so UI doesn't show a loading skeleton unnecessarily
      setLoading(false);
    }
    setPreviousToken(token);
  }, [token, previousToken]);

  useEffect(() => {
    const onPreloaded = () => { skipCartFetchRef.current = false; };
    if (typeof window !== 'undefined') {
      window.addEventListener('cart-preloaded', onPreloaded);
    }

    let local = null;
    try {
      const preloaded = typeof window !== 'undefined' && window.__preloadedCart;
      const preloadedLS = typeof window !== 'undefined' ? localStorage.getItem('cart_preloaded') : null;

      if (preloaded) {
        setCart(preloaded);
        local = JSON.stringify(preloaded);
        setMergedThisLogin(true);
        skipCartFetchRef.current = true;
        try { delete window.__preloadedCart; } catch (e) {}
      } else if (preloadedLS) {
        const parsed = JSON.parse(preloadedLS);
        setCart(parsed);
        local = JSON.stringify(parsed);
        setMergedThisLogin(true);
        skipCartFetchRef.current = true;
        try { localStorage.removeItem('cart_preloaded'); } catch(e){}
        try { delete window.__preloadedCart; } catch (e) {}
      } else {
        const ls = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
        if (ls) {
          const parsed = JSON.parse(ls);
          setCart(parsed);
          local = ls;
        }
      }
    } catch (e) {
      console.error('Error reading preloaded/local cart:', e);
    }

    const loadCartFromApi = async () => {
      try {
        const hadGuestCart = local && JSON.parse(local)?.items?.length > 0;
        const isNewLogin = !previousToken && token;

        if (isNewLogin && hadGuestCart) {
          setAwaitingMerge(true);
          if (tokenLoaded && token && !mergedThisLogin) {
            try {
              await handleMergeCart(token);
              try {
                const data = await getCart(token);
                if (data) {
                  setCart(data);
                  try { localStorage.setItem('cart', JSON.stringify(data)); } catch (e) {}
                }
              } catch (fetchErr) {}
              setMergedThisLogin(true);
              setPreviousToken(token);
              setLoading(false);
              setAwaitingMerge(false);
              skipCartFetchRef.current = true;
              return;
            } catch (mergeErr) {}
          }
        }

        if (awaitingMerge && !mergedThisLogin) {
          const waitForMerge = () => new Promise((resolve) => {
            const start = Date.now();
            const interval = setInterval(() => {
              if (mergedRef.current) { clearInterval(interval); resolve(true); }
              else if (Date.now() - start > 5000) { clearInterval(interval); resolve(false); }
            }, 100);
          });
          try { await waitForMerge(); } catch (e) {}
          setAwaitingMerge(false);
        }

        if (tokenLoaded) {
          if (token) {
            const data = await getCart(token);
            if (data && data.items) {
              setCart(data);
              try { localStorage.setItem('cart', JSON.stringify(data)); } catch (e) {}
            }
          } else {
            const preserved = local ? JSON.parse(local) : { items: [] };
            setCart(preserved);
          }
          setPreviousToken(token);
        }
      } catch (error) {
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCartFromApi();

    try {
      const preloadedLS = typeof window !== 'undefined' ? localStorage.getItem('cart_preloaded') : null;
      if (preloadedLS && tokenLoaded && token && !mergedThisLogin) {
        (async () => {
          try {
            await handleMergeCart(token);
            const data = await getCart(token);
            if (data) {
              setCart(data);
              try { localStorage.setItem('cart', JSON.stringify(data)); } catch (e) {}
            }
          } catch (e) {}
        })();
      }
    } catch (e) {}

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cart-preloaded', onPreloaded);
      }
    };
  }, [token, previousToken, tokenLoaded, awaitingMerge, handleMergeCart, mergedThisLogin]);

  const handleAddToCart = useCallback(async (productId, quantity) => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      const prevCart = cart || { items: [] };
      const currentCart = JSON.parse(JSON.stringify(prevCart));
      const existingItemIndex = currentCart.items.findIndex((item) => item.product_id === productId);

      let optimisticCart;
      if (existingItemIndex >= 0) {
        optimisticCart = {
          ...currentCart,
          items: currentCart.items.map((item, index) => index === existingItemIndex ? { ...item, quantity: (item.quantity || 1) + quantity } : item),
        };
      } else {
        optimisticCart = {
          ...currentCart,
          items: [
            ...currentCart.items,
            { id: `temp-${Date.now()}`, product_id: productId, quantity, product: { id: productId } },
          ],
        };
      }

      setCart(optimisticCart);
      try { localStorage.setItem('cart', JSON.stringify(optimisticCart)); } catch (e) {}

      const data = await addToCart(productId, quantity, token);

      try {
        const serverCart = await getCart(token);
        if (serverCart) {
          setCart(serverCart);
          try { localStorage.setItem('cart', JSON.stringify(serverCart)); } catch (e) {}
        }
      } catch (syncErr) {
        try {
          const merged = JSON.parse(JSON.stringify(optimisticCart));
          const tempIdx = merged.items.findIndex((it) => it.product_id === productId && String(it.id).startsWith('temp-'));
          if (tempIdx >= 0 && data) merged.items[tempIdx].product = data;
          try { localStorage.setItem('cart', JSON.stringify(merged)); } catch (e) {}
        } catch (e) {}
      }

      return data;
    } catch (error) {
      const prevCart = cart || { items: [] };
      setCart(prevCart);
      try { localStorage.setItem('cart', JSON.stringify(prevCart)); } catch (e) {}
      throw error;
    } finally {
      setTimeout(() => setIsAddingToCart(false), 400);
    }
  }, [token, cart, isAddingToCart]);

  const handleRemoveFromCart = useCallback(async (itemId) => {
    const id = String(itemId);
    if (removingItems.has(id)) return false;
    setRemovingItems(prev => new Set([...prev, id]));
    try {
      const ok = await removeFromCart(itemId, token);
      if (!ok) return false;
      const prevCart = cartRef.current || { items: [] };
      const currentCart = JSON.parse(JSON.stringify(prevCart));
      const idx = currentCart.items.findIndex((it) => (it.product && String(it.product.id) === String(id)) || String(it.product_id) === String(id) || String(it.id) === String(id));
      if (idx !== -1) {
        const updatedCart = { ...currentCart, items: currentCart.items.filter((_, i) => i !== idx) };
        setCart(updatedCart);
        try { localStorage.setItem('cart', JSON.stringify(updatedCart)); } catch (e) {}
      }
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    } finally {
      setTimeout(() => setRemovingItems(prev => { const newSet = new Set(prev); newSet.delete(id); return newSet; }), 300);
    }
  }, [token, removingItems]);

  const isItemBeingRemoved = useCallback((itemId) => removingItems.has(String(itemId)), [removingItems]);

  const handleUpdateCartItem = useCallback(async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity, token);
      const updated = await getCart(token);
      if (updated) {
        setCart(updated);
        try { localStorage.setItem('cart', JSON.stringify(updated)); } catch (e) {}
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [token]);

  const clearCart = useCallback(() => {
    try {
      const empty = { items: [] };
      setCart(empty);
      try { localStorage.removeItem('cart'); } catch (e) {}
      try { localStorage.setItem('cart', JSON.stringify(empty)); } catch (e) {}
      try { localStorage.removeItem('cart_merged'); } catch (e) {}
      return true;
    } catch (e) {
      console.error('Error clearing cart:', e);
      return false;
    }
  }, []);

  if (typeof window !== 'undefined') window.__setCart = setCart;

  return (
    <CartContext.Provider value={{ cart, loading, isAddingToCart, isItemBeingRemoved, addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart, updateCartItem: handleUpdateCartItem, clearCart, mergeCart: handleMergeCart }}>
      {children}
    </CartContext.Provider>
  );
}
