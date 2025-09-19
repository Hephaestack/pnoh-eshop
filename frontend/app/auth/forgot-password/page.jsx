"use client"

import { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { isLoaded, signIn } = useSignIn()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errors, setErrors] = useState({})

  // Signal page ready for smooth loading animation
  useEffect(() => {
    if (isLoaded) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setEmailSent(true)
    } catch (err) {
      const errorMessages = {}
      
      if (err.errors) {
        err.errors.forEach((error) => {
          switch (error.code) {
            case 'form_identifier_not_found':
              errorMessages.email = t('auth.error.email_not_found') || 'No account found with this email address'
              break
            case 'form_param_format_invalid':
              errorMessages.email = t('auth.error.email_invalid') || 'Please enter a valid email address'
              break
            default:
              errorMessages.general = error.longMessage || error.message || t('auth.error.general') || 'An error occurred'
          }
        })
      } else {
        errorMessages.general = t('auth.error.general') || 'An error occurred during password reset'
      }
      
      setErrors(errorMessages)
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
          {emailSent ? (
            <>
              <h1 className="text-3xl font-bold text-white">
                {t('auth.forgot_password.check_email') || 'Check Your Email'}
              </h1>
              <p className="text-gray-400">
                {t('auth.forgot_password.email_sent') || `We've sent a password reset link to ${email}`}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">
                {t('auth.forgot_password.title') || 'Forgot Password'}
              </h1>
              <p className="text-gray-400">
                {t('auth.forgot_password.subtitle') || 'Enter your email address and we\'ll send you a link to reset your password'}
              </p>
            </>
          )}
        </div>

        {emailSent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {t('auth.forgot_password.success_message') || 'Password reset email sent successfully! Check your inbox and follow the instructions.'}
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                {t('auth.forgot_password.didnt_receive') || "Didn't receive the email? Check your spam folder or try again."}
              </p>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                    setErrors({})
                  }}
                  variant="outline"
                  className="w-full border-[#404040] bg-transparent text-white hover:bg-[#232326] hover:text-white"
                >
                  {t('auth.forgot_password.try_again') || 'Try Again'}
                </Button>

                {/* Link to reset page so users who received a code can enter it */}
                <Link
                  href="/auth/reset-password"
                  className="w-full inline-flex justify-center items-center text-sm border border-transparent bg-white text-black hover:bg-gray-200 py-2 px-3"
                >
                  {t('auth.forgot_password.have_code') || 'I have a reset code'}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {errors.general && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 font-medium"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('auth.forgot_password.sending') || 'Sending...'}
                  </>
                ) : (
                  t('auth.forgot_password.button') || 'Send Reset Link'
                )}
              </Button>
            </form>
          </>
        )}

        <div className="text-center">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('auth.back_to_signin') || 'Back to sign in'}
          </Link>
        </div>
      </div>
    </div>
  )
}


