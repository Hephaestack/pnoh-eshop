"use client"

import { useEffect } from 'react'
import { useClerk, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/cart-context'
import { Loader2 } from 'lucide-react'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const { getToken } = useAuth()
  const { mergeCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback()
        
  // Re-check localStorage right before merging
  const localCartNow = localStorage.getItem("cart");
  const hasGuestItemsNow = localCartNow && JSON.parse(localCartNow)?.items?.length > 0;

  if (hasGuestItemsNow && mergeCart && getToken) {
          try {
            // requesting token for merge (silent)
            const token = await getToken();
            // token fetched (silent)
            if (token) {
              // calling mergeCart with token (silent)
              await mergeCart(token);
              try {
                const { getCart } = await import('@/lib/cart');
                const latestCart = await getCart(token);
                if (latestCart) {
                  localStorage.setItem('cart', JSON.stringify(latestCart));
                  if (typeof window !== 'undefined' && window.__setCart) {
                    window.__setCart(latestCart);
                  }
                }
              } catch (fetchErr) {
                // suppressed fetch latest cart error
              }
            }
          } catch (mergeError) {
            // suppressed merge error
            // Continue with redirect even if cart merge fails
          }
        }
        // Redirect will be handled by Clerk based on redirectUrlComplete
      } catch (error) {
        // suppressed SSO callback error
        // Redirect to sign-in page on error
        router.push('/auth/sign-in')
      }
    }

    handleCallback()
  }, [handleRedirectCallback, mergeCart, router])

  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
        <p className="text-white">Completing sign in...</p>
      </div>
    </div>
  )
}
