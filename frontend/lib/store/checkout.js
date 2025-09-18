import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      shippingInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Greece',
      },
      billingInfo: {
        sameAsShipping: true,
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Greece',
      },
      shippingMethod: 'standard',
      paymentMethod: 'card',
      orderNotes: '',
      isProcessing: false,

      // Navigation
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set(state => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
      prevStep: () => set(state => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      // Update shipping info
      updateShippingInfo: (info) => set(state => ({
        shippingInfo: { ...state.shippingInfo, ...info }
      })),

      // Update billing info
      updateBillingInfo: (info) => set(state => ({
        billingInfo: { ...state.billingInfo, ...info }
      })),

      // Set shipping method
      setShippingMethod: (method) => set({ shippingMethod: method }),

      // Set payment method
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      // Set order notes
      setOrderNotes: (notes) => set({ orderNotes: notes }),

      // Set processing state
      setProcessing: (processing) => set({ isProcessing: processing }),

      // Reset checkout
      resetCheckout: () => set({
        currentStep: 1,
        shippingInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          country: 'Greece',
        },
        billingInfo: {
          sameAsShipping: true,
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          postalCode: '',
          country: 'Greece',
        },
        shippingMethod: 'standard',
        paymentMethod: 'card',
        orderNotes: '',
        isProcessing: false,
      }),

      // Validate current step
      validateStep: (step) => {
        const state = get();
        
        switch (step) {
          case 1: // Shipping info
            const { firstName, lastName, email, address, city, postalCode } = state.shippingInfo;
            return firstName && lastName && email && address && city && postalCode;
          
          case 2: // Billing info
            if (state.billingInfo.sameAsShipping) return true;
            const billing = state.billingInfo;
            return billing.firstName && billing.lastName && billing.address && billing.city && billing.postalCode;
          
          case 3: // Shipping method
            return state.shippingMethod;
          
          default:
            return true;
        }
      },
    }),
    {
      name: 'pnoh-checkout-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCheckoutStore;
