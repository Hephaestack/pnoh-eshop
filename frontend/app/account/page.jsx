"use client"

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Loader2, User, Mail, Calendar, LogOut } from 'lucide-react'

export default function AccountPage() {
  const { t } = useTranslation()
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!isSignedIn) {
    router.push('/auth/sign-in?redirect_url=/account')
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#18181b] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">
              {t('account.title') || 'My Account'}
            </h1>
            <p className="text-gray-400">
              {t('account.subtitle') || 'Manage your account settings and preferences'}
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-[#232326] border border-[#404040] rounded-lg p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                </h2>
                <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-[#404040] pb-2">
                  {t('account.personal_info') || 'Personal Information'}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">{t('account.full_name') || 'Full Name'}</p>
                      <p className="text-white">
                        {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">{t('account.email') || 'Email'}</p>
                      <p className="text-white">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">{t('account.member_since') || 'Member Since'}</p>
                      <p className="text-white">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-[#404040] pb-2">
                  {t('account.account_settings') || 'Account Settings'}
                </h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#404040] bg-transparent text-white hover:bg-[#404040] hover:text-white"
                    onClick={() => {
                      // This would typically open Clerk's user profile modal
                      // For now, we'll just show a message
                      alert(t('account.edit_profile_notice') || 'Profile editing will be available soon')
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('account.edit_profile') || 'Edit Profile'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#404040] bg-transparent text-white hover:bg-[#404040] hover:text-white"
                    onClick={() => {
                      alert(t('account.change_password_notice') || 'Password change will be available soon')
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {t('account.change_password') || 'Change Password'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order History Section (Placeholder) */}
          <div className="bg-[#232326] border border-[#404040] rounded-lg p-6">
            <h3 className="text-lg font-medium text-white border-b border-[#404040] pb-2 mb-4">
              {t('account.order_history') || 'Order History'}
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-400">
                {t('account.no_orders') || 'No orders yet. Start shopping to see your order history here!'}
              </p>
              <Button
                className="mt-4 bg-white text-black hover:bg-gray-200"
                onClick={() => router.push('/collections')}
              >
                {t('account.start_shopping') || 'Start Shopping'}
              </Button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('account.sign_out') || 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
