"use client"

import { useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/cart-context'
import { Loader2 } from 'lucide-react'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const { mergeCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback()
        
        // Check if user has items in guest cart before merging
        const localCart = localStorage.getItem("cart");
        const hasGuestItems = localCart && JSON.parse(localCart)?.items?.length > 0;
        
        if (hasGuestItems && mergeCart) {
          try {
            await mergeCart();
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

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
        <p className="text-white">Completing sign in...</p>
      </div>
    </div>
  )
}
