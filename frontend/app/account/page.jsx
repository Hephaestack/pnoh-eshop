"use client"

import { useEffect, useState } from 'react'
import { useUser, useClerk, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Loader2, User, Mail, Calendar, LogOut, Package, Eye } from 'lucide-react'

export default function AccountPage() {
  const { t } = useTranslation()
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  const router = useRouter()
  
  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Signal page ready for smooth loading animation
  useEffect(() => {
    if (isLoaded) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [isLoaded]);

  // Fetch orders when user is loaded and signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchOrders()
    }
  }, [isLoaded, isSignedIn])

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      setOrdersError(null)
      
      // Get token directly from Clerk
      const token = await getToken()
      if (!token) {
        throw new Error('No authentication token available')
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/customer/orders`
      const ordersResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!ordersResponse.ok) {
        const errorText = await ordersResponse.text()
        throw new Error(`Failed to fetch orders: ${ordersResponse.status} ${errorText}`)
      }

      const ordersData = await ordersResponse.json()
      setOrders(ordersData)
    } catch (err) {
      setOrdersError(err.message)
      setOrdersError(err.message)
    } finally {
      setOrdersLoading(false)
    }
  }

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

  const showOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const closeOrderModal = () => {
    setShowOrderModal(false)
    setSelectedOrder(null)
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
          <div className="bg-[#232326] border border-[#404040] rounded-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-medium text-white text-center border-b border-[#404040] pb-4 mb-8">
                {t('account.order_history', 'Ιστορικό Παραγγελιών')}
            </h3>
            
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-white mb-4" />
                <p className="text-gray-400 text-lg">{t('account.orders.loading', 'Φόρτωση παραγγελιών...')}</p>
              </div>
            ) : ordersError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-400 text-lg mb-6 text-center">{t('account.orders.error', 'Σφάλμα φόρτωσης παραγγελιών')}</p>
                <Button
                  onClick={fetchOrders}
                  className="bg-white text-black hover:bg-gray-200 px-6 py-3 font-medium"
                >
                  {t('account.orders.retry', 'Προσπάθεια ξανά')}
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-[#404040] rounded-full flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
                    {t('account.no_orders', 'Δεν υπάρχουν παραγγελίες ακόμα. Αρχίστε να ψωνίζετε για να δείτε το ιστορικό των παραγγελιών σας εδώ!')}
                </p>
                <Button
                  className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-medium"
                  onClick={() => router.push('/shop/products')}
                >
                  {t('account.start_shopping', 'Αρχίστε να Ψωνίζετε')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="group bg-[#1a1a1d] border border-[#353538] rounded-xl p-6 hover:border-[#555558] hover:bg-[#1e1e21] transition-all duration-300">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#404040] to-[#303030] rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            #{order.id.slice(-8).toUpperCase()}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.created_at).toLocaleDateString('el-GR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex justify-start sm:justify-end">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
                          order.status === 'completed' || order.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          order.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            order.status === 'completed' || order.status === 'fulfilled' ? 'bg-emerald-400' :
                            order.status === 'pending' ? 'bg-amber-400' :
                            order.status === 'cancelled' ? 'bg-red-400' :
                            'bg-gray-400'
                          }`}></div>
                            {t(`account.orders.status.${order.status}`, 
                              order.status === 'completed' || order.status === 'fulfilled' ? 'Ολοκληρώθηκε' :
                              order.status === 'pending' ? 'Εκκρεμεί' :
                              order.status === 'cancelled' ? 'Ακυρώθηκε' :
                              order.status)}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Items Count */}
                      <div className="text-center md:text-left">
                        <p className="text-gray-400 text-sm mb-1">{t('account.orders.products', 'Προϊόντα')}</p>
                        <p className="text-white text-lg font-medium">{order.items?.length || 0}</p>
                      </div>
                      
                      {/* Order Time */}
                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-1">{t('account.orders.order_time', 'Ώρα παραγγελίας')}</p>
                        <p className="text-white text-lg font-medium">
                          {new Date(order.created_at).toLocaleTimeString('el-GR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      {/* Total Amount */}
                      <div className="text-center md:text-right">
                        <p className="text-gray-400 text-sm mb-1">{t('account.orders.total', 'Σύνολο')}</p>
                        <p className="text-white text-2xl font-bold">€{Number(order.total_amount).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="bg-[#252528] rounded-lg p-4 mb-6">
                        <p className="text-gray-400 text-sm mb-3">{t('account.orders.order_products', 'Προϊόντα παραγγελίας:')}</p>
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">
                                  {item.quantity}× {item.product_name || t('account.orders.product', 'Προϊόν')}
                              </span>
                              <span className="text-white text-sm font-medium">
                                €{Number(item.unit_amount || 0).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-gray-500 text-xs text-center pt-2">
                                {t('account.orders.more_products', '+{count} περισσότερα προϊόντα', { count: order.items.length - 3 })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-center">
                      <Button
                        className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 px-8 py-3 font-medium transition-all duration-300 group-hover:shadow-lg"
                        onClick={() => showOrderDetails(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                          {t('account.orders.view_details', 'Προβολή Λεπτομερειών')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#232326] border border-[#404040] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#404040] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {t('account.orders.modal.title', 'Παραγγελία')} #{selectedOrder.id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-gray-400 text-sm">
                  {new Date(selectedOrder.created_at).toLocaleDateString('el-GR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={closeOrderModal}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                ×
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Payment Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{t('account.orders.modal.payment_label', 'Πληρωμή:')}</span>
                <span className="text-white">
                  {selectedOrder.payment_status === 'succeeded' ? t('account.orders.modal.payment_status.succeeded', 'Ολοκληρώθηκε') :
                   selectedOrder.payment_status === 'pending' ? t('account.orders.modal.payment_status.pending', 'Εκκρεμεί') :
                   selectedOrder.payment_status === 'failed' ? t('account.orders.modal.payment_status.failed', 'Απέτυχε') :
                   t('account.orders.modal.payment_status.unknown', 'Άγνωστη')}
                </span>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-white font-medium mb-4">{t('account.orders.order_products', 'Προϊόντα παραγγελίας:')}</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="bg-[#2a2a2d] rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.product_name || 'Προϊόν'}</p>
                        <p className="text-gray-400 text-sm">{t('account.orders.modal.quantity', 'Ποσότητα')}: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">€{Number(item.unit_amount || 0).toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">€{Number(item.line_total || (item.unit_amount || 0) * item.quantity).toFixed(2)} {t('account.orders.modal.line_total_suffix', 'σύνολο')}</p>
                      </div>
                    </div>
                    )) || (
                    <p className="text-gray-400">{t('account.orders.modal.no_product_details', 'Δεν υπάρχουν λεπτομέρειες προϊόντων')}</p>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-[#404040] pt-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-white font-semibold">{t('account.orders.modal.total_label', 'Συνολικό ποσό:')}</span>
                  <span className="text-white font-bold">€{Number(selectedOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Order ID for Reference */}
              <div className="bg-[#2a2a2d] rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">{t('account.orders.modal.order_id_label', 'ID Παραγγελίας:')}</p>
                <p className="text-white font-mono text-sm">{selectedOrder.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
