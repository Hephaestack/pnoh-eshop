"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, Lock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CartProvider, useCart } from '../cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';

function CartPageInner() {
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);
  
  const {
    cart,
    removeFromCart,
    updateCartItem,
    loading
  } = useCart();

  // Calculate totals from cart data
  const getTotals = () => {
    if (!cart?.items) return { itemCount: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 };
    
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 5; // Free shipping over €50
    const tax = subtotal * 0.24; // 24% VAT
    const total = subtotal + shipping + tax;
    
    return { itemCount, subtotal, shipping, tax, total };
  };

  const totals = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container px-4 mx-auto">
          <div className="animate-pulse">
            <div className="w-1/4 h-8 mb-8 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="bg-gray-700 rounded h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center"
          >
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
            <h1 className="mb-4 text-3xl font-bold text-white">
              Το καλάθι σας είναι άδειο
            </h1>
            <p className="max-w-md mx-auto mb-8 text-gray-400">
              Φαίνεται ότι δεν έχετε προσθέσει ακόμα προϊόντα στο καλάθι σας. 
              Ανακαλύψτε τη συλλογή μας και βρείτε κάτι όμορφο!
            </p>
            <Link href="/shop/products">
              <Button className="text-black bg-white hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Συνέχεια Αγορών
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] pt-8 pb-16">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/shop/products">
              <Button variant="ghost" className="text-white hover:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Συνέχεια Αγορών
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Καλάθι Αγορών ({totals.itemCount})
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Προϊόντα στο Καλάθι</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center space-x-4 p-4 bg-[#18181b] rounded-lg border border-gray-700"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product?.image_url?.[0]?.replace("dl=0", "raw=1") || '/placeholder-product.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="object-cover w-20 h-20 rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {item.product?.name || 'Unknown Product'}
                        </h3>
                        <p className="mt-2 text-2xl font-bold text-white">
                          €{item.product?.price || 0}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 p-0 text-white border-gray-600 hover:bg-gray-700"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-white font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 text-white border-gray-600 hover:bg-gray-700"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8"
            >
              <Card className="bg-[#232326] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Σύνοψη Παραγγελίας</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Υποσύνολο ({totals.itemCount} προϊόντα)</span>
                      <span>€{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Μεταφορικά</span>
                      <span>{totals.shipping === 0 ? 'Δωρεάν' : `€${totals.shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>ΦΠΑ (24%)</span>
                      <span>€{totals.tax}</span>
                    </div>
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Σύνολο</span>
                      <span>€{totals.total}</span>
                    </div>
                  </div>

                  {totals.shipping === 0 && (
                    <div className="p-3 border border-green-700 rounded-lg bg-green-900/20">
                      <p className="text-sm text-center text-green-400">
                        🎉 Κερδίσατε δωρεάν μεταφορικά!
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button 
                        className="w-full font-semibold text-black bg-white hover:bg-gray-100"
                        disabled={loading}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Ασφαλής Ολοκλήρωση
                      </Button>
                    </Link>
                    
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>Ασφαλής πληρωμή με SSL</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="bg-[#232326] border-gray-700 mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Δωρεάν μεταφορικά για παραγγελίες άνω των €50</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>30 ημέρες εγγύηση επιστροφής χρημάτων</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Χειροποίητα κοσμήματα υψηλής ποιότητας</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageInner />
    </CartProvider>
  );
}
