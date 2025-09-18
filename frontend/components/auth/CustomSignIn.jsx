"use client"

import { useState, useEffect } from 'react'
import { useSignIn, useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/app/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'

export default function CustomSignIn({ redirectUrl }) {
  const { t } = useTranslation()
  const { isLoaded, signIn, setActive } = useSignIn()
  const { user } = useUser()
  const { mergeCart } = useCart()
  const { getToken } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Determine redirect URL: prefer prop, then query params (redirect_url or redirectUrl), then fromCart flag, then '/'
  const getEffectiveRedirectUrl = () => {
    if (redirectUrl) {
      return redirectUrl;
    }
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('redirect_url') || params.get('redirectUrl');
        if (q) {
          return q;
        }
        if (params.get('fromCart') === 'true') {
          return '/cart';
        }
      } catch (e) {
        // ignore
      }
    }
    return '/';
  };
  const effectiveRedirectUrl = getEffectiveRedirectUrl();

  // Persist the effective redirect for SSO fallback as early as possible.
  // This ensures that if the browser navigates away for OAuth quickly, the
  // `/sso-callback` page can still read the intended redirect destination.
  useEffect(() => {
    if (typeof window !== 'undefined' && effectiveRedirectUrl && effectiveRedirectUrl !== '/') {
      try { localStorage.setItem('clerk_redirect_url', effectiveRedirectUrl); } catch (e) { /* ignore */ }
    }
  }, [effectiveRedirectUrl]);

  // If user is already signed in, redirect after render to avoid setState-in-render
  useEffect(() => {
    if (user) {
      // use the effective redirect (considers fromCart query)
      router.push(effectiveRedirectUrl)
    }
  }, [user, router, effectiveRedirectUrl])

  // Signal page ready for smooth loading animation
  useEffect(() => {
    if (isLoaded) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [isLoaded]);

  if (user) return null


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        
  // Compute a fresh view of localStorage right before attempting merge.
  const localCart = localStorage.getItem("cart");
  const hasGuestItemsNow = localCart && JSON.parse(localCart)?.items?.length > 0;


  let finalRedirect = effectiveRedirectUrl;
  
  // Always attempt merge when there are items in localStorage at merge time.
  if (hasGuestItemsNow && mergeCart && getToken) {
          // Attempting cart merge after login (synchronous)
          try {
            
            const token = await getToken();
            if (!token) {
              // no token available for cart merge
            } else {
              const merged = await mergeCart(token);
              if (merged) {
                // merged successfully
              } else {
                // merge returned null or 204
              }
        // Fetch canonical cart from backend and persist/update context
                try {
                  const { getCart } = await import('@/lib/cart');
                  const latestCart = await getCart(token);
                  if (latestCart) {
                    localStorage.setItem('cart', JSON.stringify(latestCart));
                    if (typeof window !== 'undefined' && window.__setCart) {
                      window.__setCart(latestCart);
                    }
                    // Write a preloaded cart marker so CartProvider can use it immediately
                    if (typeof window !== 'undefined') {
                      try {
                        window.__preloadedCart = latestCart;
                        localStorage.setItem('cart_preloaded', JSON.stringify(latestCart));
                      } catch (e) {
                        // ignore
                      }
                    }
                    // If guest had items, prefer redirecting to cart page
          finalRedirect = '/cart';
                }
              } catch (fetchErr) {
                // ignore fetch error
              }
            }
          } catch (mergeError) {
            // failed to merge cart after login
          }
        }

        router.push(finalRedirect)
      } else {
        // Handle other statuses like needs verification
      }
        } catch (err) {
      // sign in error
      const errorMessages = {}
      
      if (err.errors) {
        err.errors.forEach((error) => {
          switch (error.code) {
            case 'form_identifier_not_found':
              errorMessages.email = t('auth.error.email_not_found') || 'Email not found'
              break
            case 'form_password_incorrect':
              errorMessages.password = t('auth.error.password_incorrect') || 'Incorrect password'
              break
            case 'form_identifier_exists':
              errorMessages.email = t('auth.error.email_exists') || 'Email already exists'
              break
            default:
              errorMessages.general = error.longMessage || error.message || t('auth.error.general') || 'An error occurred'
          }
        })
      } else {
        errorMessages.general = t('auth.error.general') || 'An error occurred during sign in'
      }
      
      setErrors(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return
    
    setIsLoading(true)
    try {
      // Persist redirect for SSO callback fallback (mirror sign-up behaviour)
      if (effectiveRedirectUrl && effectiveRedirectUrl !== '/') {
        try { localStorage.setItem('clerk_redirect_url', effectiveRedirectUrl); } catch (e) { /* ignore */ }
      }
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        // ensure we pass the effective redirect so Clerk will complete there after SSO
        redirectUrlComplete: effectiveRedirectUrl,
      })
    } catch (err) {
      setErrors({ general: t('auth.error.google') || 'Google sign in failed' })
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white">
          {t('auth.sign_in.title') || 'Welcome Back'}
        </h1>
        <p className="text-gray-400">
          {t('auth.sign_in.subtitle') || 'Sign in to your account to continue'}
        </p>
      </div>

      {errors.general && (
        <div className="p-4 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white">
            {t('auth.email') || 'Email'}
          </label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email_placeholder') || 'Enter your email'}
              className="pl-10 bg-[#232326] border-[#404040] text-white placeholder:text-gray-400 focus:border-white"
              disabled={isLoading}
              required
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white">
            {t('auth.password') || 'Password'}
          </label>
          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password_placeholder') || 'Enter your password'}
              className="pl-10 pr-10 bg-[#232326] border-[#404040] text-white placeholder:text-gray-400 focus:border-white"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-white"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full font-medium text-black bg-white hover:bg-gray-200"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('auth.signing_in') || 'Signing in...'}
            </>
          ) : (
            t('auth.sign_in.button') || 'Sign In'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#404040]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#18181b] px-2 text-gray-400">
            {t('auth.or') || 'Or'}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        className="w-full border-[#404040] bg-transparent text-white hover:bg-[#232326] hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {t('auth.continue_with_google') || 'Continue with Google'}
      </Button>

      <div className="space-y-2 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          {t('auth.forgot_password_link') || 'Forgot your password?'}
        </Link>
        <p className="text-sm text-gray-400">
          {t('auth.dont_have_account') || "Don't have an account?"}{' '}
          <Link
            href={`/auth/sign-up${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`}
            className="font-medium text-white hover:underline"
          >
            {t('auth.sign_up.link') || 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  )
}
