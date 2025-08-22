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
            console.debug('[SSO] requesting token for merge');
            const token = await getToken();
            console.debug('[SSO] token fetched', !!token, token ? `len=${token.length}` : '');
            if (token) {
              console.debug('[SSO] calling mergeCart with token');
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
                console.error('Failed to fetch latest cart after SSO merge:', fetchErr);
              }
            }
          } catch (mergeError) {
            console.error('Failed to merge cart after SSO:', mergeError);
            // Continue with redirect even if cart merge fails
          }
        }
        // Redirect will be handled by Clerk based on redirectUrlComplete
      } catch (error) {
        console.error('SSO callback error:', error)
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
