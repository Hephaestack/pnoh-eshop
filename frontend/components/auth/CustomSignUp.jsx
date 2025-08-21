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

  // If user is already signed in, redirect after render to avoid setState-in-render
  useEffect(() => {
    if (user) {
      // use a router push inside an effect to avoid updating Router during render
      router.push(redirectUrl)
    }
  }, [user, router, redirectUrl])

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
        await signUp.create(payload)
      } catch (createErr) {
        // If Clerk responds that first_name/last_name are unknown params, retry without names
        const unknownNameParam = createErr?.errors?.some((e) => e.code === 'form_param_unknown' && (e.meta?.paramName === 'first_name' || e.meta?.paramName === 'last_name'))
        if (unknownNameParam) {
          console.warn('Clerk rejected name params; retrying sign up without first/last name')
          await signUp.create({ emailAddress: email, password })
        } else {
          throw createErr
        }
      }

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      // Log full error for easier debugging
      console.error('Sign up error:', err)
      try { console.error('Sign up error (stringified):', JSON.stringify(err, null, 2)) } catch (e) {}

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
              errorMessages.general = t('auth.error.captcha') || 'Captcha validation failed — try refreshing the page'
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
                    console.warn(`Token retrieval attempt ${i + 1} failed:`, err)
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
                    console.warn(`Name update failed (${res.status}):`, errorText)
                  } else {
                    console.log('Names updated successfully')
                  }
                }).catch((err) => console.warn('Name update request error:', err))
              } catch (err) {
                console.warn('Failed to get Clerk token for name update:', err)
              }
            }, 1000) // Wait 1 second to ensure session is established
          }

        } catch (e) {
          console.warn('Failed to call backend to update names:', e)
        }

        // Merge cart if user had guest items
        if (hasGuestItems && mergeCart) {
          try {
            await mergeCart();
          } catch (mergeError) {
            console.error('Failed to merge cart after sign up:', mergeError);
            // Continue with redirect even if cart merge fails
          }
        }

        router.push(redirectUrl)
      } else {
        console.log('Verification incomplete:', result)
        setErrors({ code: t('auth.error.verification_failed') || 'Verification failed' })
      }
    } catch (err) {
      console.error('Verification error:', err)
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
        redirectUrlComplete: redirectUrl,
      })
    } catch (err) {
      console.error('Google sign up error:', err)
      setErrors({ general: t('auth.error.google') || 'Google sign up failed' })
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (pendingVerification) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            {t('auth.verify_email.title') || 'Verify Your Email'}
          </h1>
          <p className="text-gray-400">
            {t('auth.verify_email.subtitle') || `We've sent a verification code to ${email}`}
          </p>
        </div>

        {errors.code && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {errors.code}
          </div>
        )}

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
            className="w-full bg-white text-black hover:bg-gray-200 font-medium"
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
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('auth.back_to_signup') || 'Back to sign up'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {t('auth.sign_up.title') || 'Create Account'}
        </h1>
        <p className="text-gray-400">
          {t('auth.sign_up.subtitle') || 'Join us to start shopping beautiful jewelry'}
        </p>
      </div>

      {errors.general && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
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
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
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
          className="w-full bg-white text-black hover:bg-gray-200 font-medium"
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
        
  {/* Clerk Smart CAPTCHA container (required for Smart CAPTCHA init) */}
  <div id="clerk-captcha" className="mt-2" />
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
            href="/auth/sign-in"
            className="text-white hover:underline font-medium"
          >
            {t('auth.sign_in.link') || 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
