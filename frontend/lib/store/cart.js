import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      // Add item to cart
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(
          item => item.id === product.id && 
          item.variant?.size === product.variant?.size && 
          item.variant?.color === product.variant?.color
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id && 
              item.variant?.size === product.variant?.size && 
              item.variant?.color === product.variant?.color
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            )
          });
        } else {
          set({
            items: [...items, { ...product, quantity: product.quantity || 1 }]
          });
        }
      },

      // Remove item from cart
      removeItem: (productId, variant = null) => {
        set({
          items: get().items.filter(
            item => !(item.id === productId && 
            (!variant || (item.variant?.size === variant?.size && item.variant?.color === variant?.color)))
          )
        });
      },

      // Update item quantity
      updateQuantity: (productId, quantity, variant = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === productId && 
            (!variant || (item.variant?.size === variant?.size && item.variant?.color === variant?.color))
              ? { ...item, quantity }
              : item
          )
        });
      },

      // Clear cart
      clearCart: () => set({ items: [] }),

      // Get cart totals
      getTotals: () => {
        const items = get().items;
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.24; // 24% VAT for Greece
        const shipping = subtotal > 50 ? 0 : 5; // Free shipping over €50
        const total = subtotal + tax + shipping;

        return {
          subtotal: Number(subtotal.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          total: Number(total.toFixed(2)),
          itemCount: items.reduce((count, item) => count + item.quantity, 0)
        };
      },

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'pnoh-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
