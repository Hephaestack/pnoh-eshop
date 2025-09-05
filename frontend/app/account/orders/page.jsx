"use client"

import { useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Loader2, Package, Calendar, CreditCard, Eye, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function OrdersPage() {
  // OrdersPage - runtime logs removed per cleanup
  const { t } = useTranslation()
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isLoaded) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchOrders()
    }
  }, [isLoaded, isSignedIn])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
  // runtime logs removed
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
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!isSignedIn) {
    router.push('/auth/sign-in?redirect_url=/account/orders')
    return null
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case 'cancelled':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      case 'fulfilled':
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Πληρωμένη'
      case 'pending': return 'Εκκρεμεί'
      case 'cancelled': return 'Ακυρώθηκε'
      case 'fulfilled': return 'Παραδόθηκε'
      default: return status
    }
  }

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'succeeded': return 'Επιτυχής'
      case 'pending': return 'Εκκρεμεί'
      case 'failed': return 'Απέτυχε'
      case 'refunded': return 'Επιστράφηκε'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-[#18181b] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/account')}
              className="border-[#404040] bg-transparent text-gray-400 hover:bg-[#232326] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {t('orders.title', 'Οι Παραγγελίες μου')}
              </h1>
              <p className="text-gray-400">
                {t('orders.subtitle', 'Προβολή και διαχείριση των παραγγελιών σας')}
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400">Σφάλμα: {error}</p>
              <Button
                onClick={fetchOrders}
                className="mt-2 bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                Δοκιμάστε ξανά
              </Button>
            </div>
          )}

          {/* Orders List */}
          {!error && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-[#232326] border border-[#404040] rounded-lg p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    Δεν έχετε παραγγελίες ακόμα
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Όταν κάνετε την πρώτη σας παραγγελία, θα εμφανιστεί εδώ.
                  </p>
                  <Button
                    onClick={() => router.push('/shop/products')}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Αρχίστε να Ψωνίζετε
                  </Button>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#232326] border border-[#404040] rounded-lg p-6 hover:border-[#505050] transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Order Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-gray-400" />
                          <span className="text-white font-medium">
                            Παραγγελία #{order.id.slice(-8)}
                          </span>
                          <span className={getStatusBadge(order.status)}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(order.created_at).toLocaleDateString('el-GR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-4 h-4" />
                            <span>{getPaymentStatusText(order.payment_status)}</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-400">
                          {order.items.length} προϊόν{order.items.length !== 1 ? 'τα' : ''}
                        </div>
                      </div>

                      {/* Order Total & Actions */}
                      <div className="flex items-center justify-between lg:flex-col lg:items-end lg:space-y-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            €{parseFloat(order.total_amount).toFixed(2)}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => router.push(`/account/orders/${order.id}`)}
                          className="bg-white text-black hover:bg-gray-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Προβολή
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
