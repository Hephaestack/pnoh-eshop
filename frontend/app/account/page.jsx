"use client"

import { useEffect } from 'react'
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

  // Signal page ready for smooth loading animation
  useEffect(() => {
    if (isLoaded) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [isLoaded]);

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
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">
              {t('account.title', 'Ο Λογαριασμός μου')}
            </h1>
            <p className="text-gray-400">
              {t('account.subtitle', 'Διαχειριστείτε τις ρυθμίσεις και τις προτιμήσεις του λογαριασμού σας')}
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-[#232326] border border-[#404040] rounded-lg p-8 space-y-8">
            {/* User Header */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-20 h-20 bg-[#404040] rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                </h2>
                <p className="text-gray-400 text-lg">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white text-center border-b border-[#404040] pb-3">
                {t('account.personal_info', 'Προσωπικές Πληροφορίες')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <User className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">{t('account.full_name', 'Πλήρες Όνομα')}</p>
                    <p className="text-white text-lg font-medium">
                      {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Δεν έχει οριστεί'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 text-center">
                  <Mail className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">{t('account.email', 'Email')}</p>
                    <p className="text-white text-lg font-medium">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 text-center md:col-span-2">
                  <Calendar className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">{t('account.member_since', 'Μέλος από')}</p>
                    <p className="text-white text-lg font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('el-GR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Άγνωστο'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="bg-[#232326] border border-[#404040] rounded-lg p-8">
            <h3 className="text-xl font-medium text-white text-center border-b border-[#404040] pb-3 mb-6">
              {t('account.order_history', 'Ιστορικό Παραγγελιών')}
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg mb-6">
                {t('account.no_orders', 'Δεν υπάρχουν παραγγελίες ακόμα. Αρχίστε να ψωνίζετε για να δείτε το ιστορικό των παραγγελιών σας εδώ!')}
              </p>
              <Button
                className="mt-4 bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg"
                onClick={() => router.push('/shop/products')}
              >
                {t('account.start_shopping', 'Αρχίστε να Ψωνίζετε')}
              </Button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 px-8 py-3 text-lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {t('account.sign_out', 'Αποσύνδεση')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
