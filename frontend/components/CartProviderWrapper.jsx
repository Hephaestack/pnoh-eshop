"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartProvider } from "@/app/cart-context";

export default function CartProviderWrapper({ children }) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (isSignedIn) {
          const jwt = await getToken();
          setToken(jwt);
        } else {
          setToken(null);
        }
      } catch (error) {
        setToken(null);
      } finally {
        setTokenLoaded(true);
      }
    };

    fetchToken();
  }, [getToken, isSignedIn, user?.id]); // Re-run when auth state changes

  // Always render CartProvider so `useCart` is available to the app. Pass
  // `tokenLoaded` so the provider can delay API fetches until we've resolved
  // the initial token and avoid overwriting a merged cart.
  return (
    <CartProvider token={token} tokenLoaded={tokenLoaded}>
      {children}
    </CartProvider>
  );
}
