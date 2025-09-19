"use client"

import { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const { isLoaded, signIn } = useSignIn()
  const router = useRouter()

  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (isLoaded) window.dispatchEvent(new Event('page-ready'))
  }, [isLoaded])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    if (!code) {
      setErrors({ code: { locale: t('auth.error.code_required') || 'Reset code is required', en: t('auth.error.code_required', { lng: 'en' }) || 'Reset code is required' } })
      setIsLoading(false)
      return
    }

    if (!password || password.length < 8) {
      setErrors({ password: { locale: t('auth.error.password_too_short') || 'Password must be at least 8 characters', en: t('auth.error.password_too_short', { lng: 'en' }) || 'Password must be at least 8 characters' } })
      setIsLoading(false)
      return
    }

    if (password !== confirm) {
      setErrors({ confirm: { locale: t('auth.error.passwords_mismatch') || 'Passwords do not match', en: t('auth.error.passwords_mismatch', { lng: 'en' }) || 'Passwords do not match' } })
      setIsLoading(false)
      return
    }

    try {
      // Use Clerk's recommended reset flow: attemptFirstFactor then setActive
      if (!signIn) {
        setErrors({ general: { locale: t('auth.error.general') || 'Reset API not available', en: t('auth.error.general', { lng: 'en' }) || 'Reset API not available' } })
        setIsLoading(false)
        return
      }

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })

      // If Clerk completed the flow, activate the session so the client is signed in
      if (result?.status === 'complete') {
        try {
          if (result.createdSessionId) {
            await signIn.setActive({ session: result.createdSessionId })
          }
        } catch (e) {
          // Activation failed silently; still treat password reset as successful
          console.warn('Failed to set active session after reset', e)
        }

        setSuccess(true)
        // Wait a moment so the success message shows, then refresh the app router
        // so client-side data (useUser/useAuth) picks up the new session immediately.
        setTimeout(async () => {
          try {
            if (router && typeof router.refresh === 'function') {
              await router.refresh()
            }
          } catch (e) {
            // ignore refresh errors
          }

          try {
            if (typeof window !== 'undefined') {
              // Force a full navigation reload so all server/client data picks up the new session
              window.location.replace('/')
              return
            }
          } catch (e) {
            // ignore
          }

          // Fallback to client navigation
          router.push('/')
        }, 1200)
      } else {
        setErrors({ general: { locale: t('auth.error.general') || 'Unexpected state, please try again', en: t('auth.error.general', { lng: 'en' }) || 'Unexpected state, please try again' } })
      }
    } catch (err) {
      const msgs = {}
      if (err?.errors) {
        err.errors.forEach((er) => {
          switch (er.code) {
            case 'form_param_format_invalid':
              msgs.general = { locale: t('auth.error.email_invalid') || 'Invalid input', en: t('auth.error.email_invalid', { lng: 'en' }) || 'Invalid input' }
              break
            case 'expired_code':
              msgs.code = { locale: t('auth.error.code_expired') || 'Code expired or invalid', en: t('auth.error.code_expired', { lng: 'en' }) || 'Code expired or invalid' }
              break
            default:
              msgs.general = { locale: er.longMessage || er.message || t('auth.error.general') || 'An error occurred', en: t('auth.error.general', { lng: 'en' }) || 'An error occurred' }
          }
        })
      } else {
        msgs.general = { locale: t('auth.error.general') || 'An error occurred during password reset', en: t('auth.error.general', { lng: 'en' }) || 'An error occurred during password reset' }
      }
      setErrors(msgs)
    } finally {
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

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">{t('auth.reset_password.title') || 'Reset Password'}</h1>
          <p className="text-gray-400">{t('auth.reset_password.subtitle') || 'Enter the code you received and choose a new password'}</p>
        </div>

        {success ? (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {t('auth.reset_password.success') || 'Password updated — redirecting to sign in...'}
          </div>
        ) : (
          <>
            {errors.general && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <div>{errors.general.locale || errors.general}</div>
                {errors.general.en && <div className="text-xs text-red-200 mt-1">{errors.general.en}</div>}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-white">{t('auth.verification_code') || 'Reset Code'}</label>
                <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('auth.code_placeholder') || 'Enter reset code'} className="bg-[#232326] border-[#404040] text-white placeholder:text-gray-400" />
                {errors.code && <p className="text-sm text-red-400">{errors.code.locale || errors.code}{errors.code.en ? <div className="text-xs text-red-200 mt-1">{errors.code.en}</div> : null}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">{t('auth.password') || 'New Password'}</label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password_placeholder') || 'Enter your new password'} className="pl-10 pr-10 bg-[#232326] border-[#404040] text-white placeholder:text-gray-400" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password.locale || errors.password}{errors.password.en ? <div className="text-xs text-red-200 mt-1">{errors.password.en}</div> : null}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium text-white">{t('auth.confirm_password') || 'Confirm Password'}</label>
                <div className="relative">
                  <Input id="confirm" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={t('auth.confirm_password_placeholder') || 'Confirm new password'} className="pr-10 bg-[#232326] border-[#404040] text-white placeholder:text-gray-400" />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-sm text-red-400">{errors.confirm.locale || errors.confirm}{errors.confirm.en ? <div className="text-xs text-red-200 mt-1">{errors.confirm.en}</div> : null}</p>}
              </div>

              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('auth.reset_password.sending') || 'Updating...'}
                  </>
                ) : (
                  t('auth.reset_password.button') || 'Update Password'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/auth/sign-in" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('auth.back_to_signin') || 'Back to sign in'}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
