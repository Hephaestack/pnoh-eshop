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
        // but as a fallback, if Clerk doesn't redirect us, we read any saved
        // redirect URL from localStorage and navigate there.
        // Also, ensure cart merge has a better chance to run by retrying token retrieval.
        const fallbackRedirect = (() => {
          try {
            return localStorage.getItem('clerk_redirect_url') || null
          } catch (e) {
            return null
          }
        })();

        // If Clerk didn't perform redirect, wait a tick and then navigate to fallback if present
        setTimeout(async () => {
          try {
            // Attempt to ensure a token is available (try a few times)
            let token = null
            if (getToken) {
              for (let i = 0; i < 4; i++) {
                try {
                  token = await getToken()
                  if (token) break
                } catch (e) {
                  // wait a short time before retrying
                  await new Promise((r) => setTimeout(r, 300))
                }
              }
            }

            // If we still have guest items, try a best-effort merge using the token we obtained (if any)
            const localCartNow = localStorage.getItem("cart");
            const hasGuestItemsNow = localCartNow && JSON.parse(localCartNow)?.items?.length > 0;
            if (hasGuestItemsNow && mergeCart) {
              try {
                await mergeCart(token)
                try {
                  const { getCart } = await import('@/lib/cart')
                  const latestCart = token ? await getCart(token) : null
                  if (latestCart) {
                    localStorage.setItem('cart', JSON.stringify(latestCart))
                    if (typeof window !== 'undefined' && window.__setCart) window.__setCart(latestCart)
                  }
                } catch (e) {
                  // ignore
                }
              } catch (e) {
                // ignore merge error
              }
            }

            // If Clerk didn't redirect, use fallback redirect if available, otherwise go to '/'
            if (fallbackRedirect) {
              router.replace(fallbackRedirect)
            }
          } catch (e) {
            // ignore
          }
        }, 500)
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
