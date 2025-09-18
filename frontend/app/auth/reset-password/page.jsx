"use client"

import { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Lock } from 'lucide-react'

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

  useEffect(() => {
    if (isLoaded) window.dispatchEvent(new Event('page-ready'))
  }, [isLoaded])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    if (!code) {
      setErrors({ code: t('auth.error.code_required') || 'Reset code is required' })
      setIsLoading(false)
      return
    }

    if (!password || password.length < 8) {
      setErrors({ password: t('auth.error.password_too_short') || 'Password must be at least 8 characters' })
      setIsLoading(false)
      return
    }

    if (password !== confirm) {
      setErrors({ confirm: t('auth.error.passwords_mismatch') || 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    try {
      // Clerk exposes resetPasswordEmailCode API on signIn.resetPasswordEmailCode
      if (!signIn || !signIn.resetPasswordEmailCode) {
        setErrors({ general: t('auth.error.general') || 'Reset API not available' })
        setIsLoading(false)
        return
      }

      // submitPassword will verify the code and set the new password
      const result = await signIn.resetPasswordEmailCode.submitPassword({ code, password })

      // The Clerk SDK should return a result or throw. Treat success as completed.
      setSuccess(true)

      // Optionally, navigate to sign-in page after a short delay
      setTimeout(() => router.push('/auth/sign-in'), 1200)
    } catch (err) {
      const msgs = {}
      if (err?.errors) {
        err.errors.forEach((er) => {
          switch (er.code) {
            case 'form_param_format_invalid':
              msgs.general = t('auth.error.email_invalid') || 'Invalid input'
              break
            case 'expired_code':
              msgs.code = t('auth.error.code_expired') || 'Code expired or invalid'
              break
            default:
              msgs.general = er.longMessage || er.message || t('auth.error.general') || 'An error occurred'
          }
        })
      } else {
        msgs.general = t('auth.error.general') || 'An error occurred during password reset'
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
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-white">{t('auth.verification_code') || 'Reset Code'}</label>
                <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('auth.code_placeholder') || 'Enter reset code'} className="bg-[#232326] border-[#404040] text-white placeholder:text-gray-400" />
                {errors.code && <p className="text-sm text-red-400">{errors.code}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">{t('auth.password') || 'New Password'}</label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password_placeholder') || 'Enter your new password'} className="pl-10 bg-[#232326] border-[#404040] text-white placeholder:text-gray-400" />
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium text-white">{t('auth.confirm_password') || 'Confirm Password'}</label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={t('auth.confirm_password_placeholder') || 'Confirm new password'} className="bg-[#232326] border-[#404040] text-white placeholder:text-gray-400" />
                {errors.confirm && <p className="text-sm text-red-400">{errors.confirm}</p>}
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
                {t('auth.back_to_signin') || 'Back to sign in'}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
