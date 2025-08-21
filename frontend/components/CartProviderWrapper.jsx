"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartProvider } from "@/app/cart-context";

export default function CartProviderWrapper({ children }) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        try {
          const jwt = await getToken();
          console.log('Token fetched:', jwt ? 'present' : 'null');
          setToken(jwt);
        } catch (error) {
          console.error("Error getting token:", error);
          setToken(null);
        }
      } else {
        console.log('User not signed in, setting token to null');
        setToken(null);
      }
    };

    fetchToken();
  }, [getToken, isSignedIn, user?.id]); // Re-run when auth state changes

  return (
    <CartProvider token={token}>
      {children}
    </CartProvider>
  );
}
