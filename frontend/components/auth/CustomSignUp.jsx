"use client"

import { useState, useEffect } from 'react'
import { useSignUp, useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/app/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'

export default function CustomSignUp({ redirectUrl = '/' }) {
  const { t } = useTranslation()
  const { isLoaded, signUp, setActive } = useSignUp()
  const { user } = useUser()
  const { getToken } = useAuth()
  const { mergeCart } = useCart()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [completingSignUp, setCompletingSignUp] = useState(false) // Prevent redirect during cart merge

  // Compute effective redirect URL: prefer prop, then query params, then '/'
  const getEffectiveRedirectUrl = () => {
    if (redirectUrl) {
      console.log('SignUp: Using prop redirectUrl:', redirectUrl);
      return redirectUrl;
    }
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('redirect_url') || params.get('redirectUrl');
        if (q) {
          console.log('SignUp: Using query param redirect_url:', q);
          return q;
        }
      } catch (e) {}
    }
    console.log('SignUp: No redirect specified, using default /');
    return '/';
  };
  const effectiveRedirectUrl = getEffectiveRedirectUrl();
  console.log('SignUp: Final effectiveRedirectUrl:', effectiveRedirectUrl);

  // If user is already signed in, redirect after render to avoid setState-in-render
  // BUT don't redirect if we're in the middle of email verification OR completing signup with cart merge
  useEffect(() => {
    if (user && !pendingVerification && !completingSignUp) {
      console.log('SignUp: User exists, not pending verification, and not completing signup, redirecting to:', effectiveRedirectUrl);
      // use a router push inside an effect to avoid updating Router during render
      router.push(effectiveRedirectUrl)
    } else if (user && (pendingVerification || completingSignUp)) {
      console.log('SignUp: User exists but verification pending or completing signup, staying on page');
    }
  }, [user, router, effectiveRedirectUrl, pendingVerification, completingSignUp])

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

    // Basic client-side validation to reduce server rejections
    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()
    const nameRegex = /^[\p{L}.'\-\s]{1,40}$/u
    const clientErrors = {}
    if (!trimmedFirst || !nameRegex.test(trimmedFirst)) clientErrors.firstName = t('auth.error.first_name_invalid') || 'Please enter a valid first name'
    if (!trimmedLast || !nameRegex.test(trimmedLast)) clientErrors.lastName = t('auth.error.last_name_invalid') || 'Please enter a valid last name'
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Build payload and attempt sign up. Some Clerk projects may reject name params
      // (returned as `first_name`/`last_name`), so retry without them if needed.
      const payload = { emailAddress: email, password }
      if (firstName) payload.firstName = firstName
      if (lastName) payload.lastName = lastName

      try {
        await signUp.create(payload, { captchaMode: 'always_on' })
      } catch (createErr) {
        // If Clerk responds that first_name/last_name are unknown params, retry without names
        const unknownNameParam = createErr?.errors?.some((e) => e.code === 'form_param_unknown' && (e.meta?.paramName === 'first_name' || e.meta?.paramName === 'last_name'))
        if (unknownNameParam) {
          // Clerk rejected name params; retrying without them
          await signUp.create({ emailAddress: email, password }, { captchaMode: 'always_on' })
        } else {
          throw createErr
        }
      }

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      // Error occurred during sign up (output suppressed)
      try { /* suppressed sign up error for privacy */ } catch (e) {}

      const errorMessages = {}
      if (err?.errors) {
        err.errors.forEach((error) => {
          switch (error.code) {
            case 'form_identifier_exists':
              errorMessages.email = t('auth.error.email_exists') || 'Email already exists'
              break
            case 'form_password_pwned':
              errorMessages.password = t('auth.error.password_pwned') || 'This password has been found in a data breach. Please choose a different password.'
              break
            case 'form_password_length_too_short':
              errorMessages.password = t('auth.error.password_too_short') || 'Password must be at least 8 characters'
              break
            case 'form_param_format_invalid':
              // Map server-side format errors to specific fields
              const param = error.meta?.paramName || ''
              if (param.includes('email') || param.includes('email_address')) {
                errorMessages.email = t('auth.error.email_invalid') || 'Please enter a valid email address'
              } else if (param.includes('first') || param.includes('first_name')) {
                errorMessages.firstName = t('auth.error.first_name_invalid') || 'Please enter a valid first name'
              } else if (param.includes('last') || param.includes('last_name')) {
                errorMessages.lastName = t('auth.error.last_name_invalid') || 'Please enter a valid last name'
              } else {
                errorMessages.general = error.longMessage || error.message || t('auth.error.general') || 'An error occurred'
              }
              break
            // Captcha related errors from Clerk
            case 'captcha_invalid':
            case 'captcha_missing_token':
            case 'captcha_not_enabled':
              errorMessages.general = t('auth.error.captcha') || 'Captcha validation failed  try refreshing the page'
              break
            default:
              errorMessages.general = error.longMessage || error.message || t('auth.error.general') || 'An error occurred'
          }
        })
      } else {
        errorMessages.general = t('auth.error.general') || 'An error occurred during sign up'
      }

      setErrors(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === 'complete') {
        console.log('SignUp: Email verification complete, setting completingSignUp=true');
        console.log('SignUp: redirectUrl prop received:', redirectUrl);
        console.log('SignUp: effectiveRedirectUrl computed:', effectiveRedirectUrl);
        setCompletingSignUp(true); // Prevent useEffect redirect during cart merge
        
        await setActive({ session: result.createdSessionId })
        
        // Check if user has items in guest cart before merging
        const localCart = localStorage.getItem("cart");
        const hasGuestItems = localCart && JSON.parse(localCart)?.items?.length > 0;
        
        // If user provided names locally, attempt to update Clerk via backend to preserve them
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
          if (firstName || lastName) {
            // fire-and-forget; add delay to ensure session is properly established
            setTimeout(async () => {
              try {
                // Try multiple times to get token as it might take a moment after setActive
                let token = null
                for (let i = 0; i < 3; i++) {
                  try {
                    token = getToken ? await getToken() : null
                    if (token) break
                    // Wait a bit before retrying
                    await new Promise(resolve => setTimeout(resolve, 500))
                  } catch (err) {
                    // token retrieval failed; continue retry loop silently
                  }
                }

                const headers = { 'Content-Type': 'application/json' }
                if (token) {
                  headers['Authorization'] = `Bearer ${token}`
                }

                fetch(`${apiUrl}/users/update-names`, {
                  method: 'POST',
                  headers,
                  // Always include credentials to support both token and cookie auth
                  credentials: 'include',
                  body: JSON.stringify({ first_name: firstName, last_name: lastName }),
                }).then(async (res) => {
                  if (!res.ok) {
                    const errorText = await res.text()
                    // name update failed; suppressed console output
                  } else {
                    // names updated successfully (silent)
                  }
                }).catch((err) => { /* suppressed name update error */ })
              } catch (err) {
                // suppressed token retrieval error for name update
              }
            }, 1000) // Wait 1 second to ensure session is established
          }

        } catch (e) {
          // suppressed backend name update call error
        }

  // Merge cart if user has guest items in localStorage now
  let finalRedirect = effectiveRedirectUrl;
  console.log('SignUp: Initial finalRedirect:', finalRedirect);
  const localCartNow = localStorage.getItem("cart");
  const hasGuestItemsNow = localCartNow && JSON.parse(localCartNow)?.items?.length > 0;
  console.log('SignUp: localCart exists:', !!localCartNow);
  console.log('SignUp: hasGuestItemsNow:', hasGuestItemsNow);
  console.log('SignUp: mergeCart function exists:', !!mergeCart);
  console.log('SignUp: getToken function exists:', !!getToken);
  
  // Always attempt merge when there are items in localStorage at merge time (same as sign-in)
  if (hasGuestItemsNow && mergeCart && getToken) {
    console.log('SignUp: Attempting cart merge...');
    try {
      const token = await getToken();
      console.log('SignUp: Got token for merge:', !!token);
      if (!token) {
        console.log('SignUp: No token available for cart merge');
      } else {
        const merged = await mergeCart(token);
        console.log('SignUp: Merge result:', merged);
        if (merged) {
          console.log('SignUp: Merge successful');
        } else {
          console.log('SignUp: Merge returned null or 204');
        }
        
        // Fetch canonical cart from backend and persist/update context (same as sign-in)
        try {
          const { getCart } = await import('@/lib/cart');
          const latestCart = await getCart(token);
          console.log('SignUp: Latest cart from server:', latestCart);
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
            console.log('SignUp: Updated finalRedirect to /cart due to merged cart');
          }
        } catch (fetchErr) {
          console.log('SignUp: Error fetching cart after merge:', fetchErr);
          // ignore fetch error
        }
      }
    } catch (mergeError) {
      console.log('SignUp: Error during cart merge:', mergeError);
      // failed to merge cart after sign up
    }
  }

        console.log('SignUp: Final redirect URL:', finalRedirect);
        console.log('SignUp: About to call router.push with:', finalRedirect);
        console.log('SignUp: Current location before redirect:', window?.location?.href);
        setCompletingSignUp(false); // Allow redirect now
        router.push(finalRedirect)
      } else {
        // verification incomplete (silent)
        setErrors({ code: t('auth.error.verification_failed') || 'Verification failed' })
      }
    } catch (err) {
      // suppressed verification error
      const errorMessages = {}
      
      if (err.errors) {
        err.errors.forEach((error) => {
          switch (error.code) {
            case 'form_code_incorrect':
              errorMessages.code = t('auth.error.code_incorrect') || 'Incorrect verification code'
              break
            default:
              errorMessages.code = error.longMessage || error.message || t('auth.error.verification_failed') || 'Verification failed'
          }
        })
      } else {
        errorMessages.code = t('auth.error.verification_failed') || 'Verification failed'
      }
      
      setErrors(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return
    
    setIsLoading(true)
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: effectiveRedirectUrl,
      })
    } catch (err) {
      // suppressed google sign up error
      setErrors({ general: t('auth.error.google') || 'Google sign up failed' })
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

  if (pendingVerification) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('auth.verify_email.title') || 'Verify Your Email'}
          </h1>
          <p className="text-gray-400">
            {t('auth.verify_email.subtitle') || `We've sent a verification code to ${email}`}
          </p>
        </div>

        {errors.code && (
          <div className="p-4 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
            {errors.code}
          </div>
        )}

  {/* Only render verification form, no CAPTCHA here */}
  <form onSubmit={handleVerification} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-white">
              {t('auth.verification_code') || 'Verification Code'}
            </label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('auth.code_placeholder') || 'Enter verification code'}
              className="bg-[#232326] border-[#404040] text-white placeholder:text-gray-400 focus:border-white text-center text-lg tracking-widest"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-medium text-black bg-white hover:bg-gray-200"
            disabled={isLoading || !code}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('auth.verifying') || 'Verifying...'}
              </>
            ) : (
              t('auth.verify_email.button') || 'Verify Email'
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setPendingVerification(false)}
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            {t('auth.back_to_signup') || 'Back to sign up'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white">
          {t('auth.sign_up.title') || 'Create Account'}
        </h1>
        <p className="text-gray-400">
          {t('auth.sign_up.subtitle') || 'Join us to start shopping beautiful jewelry'}
        </p>
      </div>

      {errors.general && (
        <div className="p-4 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-white">
              {t('auth.first_name') || 'First Name'}
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('auth.first_name_placeholder') || 'First name'}
                className="pl-10 bg-[#232326] border-[#404040] text-white placeholder:text-gray-400 focus:border-white"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-white">
              {t('auth.last_name') || 'Last Name'}
            </label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('auth.last_name_placeholder') || 'Last name'}
              className="bg-[#232326] border-[#404040] text-white placeholder:text-gray-400 focus:border-white"
              disabled={isLoading}
              required
            />
          </div>
        </div>

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
              placeholder={t('auth.password_placeholder') || 'Create a strong password'}
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
          <p className="text-xs text-gray-400">
            {t('auth.password_requirements') || 'Password must be at least 8 characters long'}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full font-medium text-black bg-white hover:bg-gray-200"
          disabled={isLoading || !email || !password || !firstName || !lastName}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('auth.creating_account') || 'Creating account...'}
            </>
          ) : (
            t('auth.sign_up.button') || 'Create Account'
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
        onClick={handleGoogleSignUp}
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

      <div className="text-center">
        <p className="text-sm text-gray-400">
          {t('auth.already_have_account') || 'Already have an account?'}{' '}
          <Link
            href={`/auth/sign-in${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`}
            className="font-medium text-white hover:underline"
          >
            {t('auth.sign_in.link') || 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
