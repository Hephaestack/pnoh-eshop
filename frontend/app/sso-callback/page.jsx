"use client"

import { useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback()
        // Redirect will be handled by Clerk based on redirectUrlComplete
      } catch (error) {
        console.error('SSO callback error:', error)
        // Redirect to sign-in page on error
        router.push('/auth/sign-in')
      }
    }

    handleCallback()
  }, [handleRedirectCallback, router])

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
