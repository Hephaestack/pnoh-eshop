"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, Lock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import useCartStore from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';

export default function CartPage() {
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);
  
  const {
    items,
    updateQuantity,
    removeItem,
    getTotals,
    isLoading
  } = useCartStore();

  const totals = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Το καλάθι σας είναι άδειο
            </h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Φαίνεται ότι δεν έχετε προσθέσει ακόμα προϊόντα στο καλάθι σας. 
              Ανακαλύψτε τη συλλογή μας και βρείτε κάτι όμορφο!
            </p>
            <Link href="/collections">
              <Button className="bg-white text-black hover:bg-gray-100">
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
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/collections">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Προϊόντα στο Καλάθι</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.variant?.size || ''}-${item.variant?.color || ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center space-x-4 p-4 bg-[#18181b] rounded-lg border border-gray-700"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <div className="flex space-x-2 mt-1">
                            {item.variant.size && (
                              <Badge variant="secondary" className="text-xs">
                                Μέγεθος: {item.variant.size}
                              </Badge>
                            )}
                            {item.variant.color && (
                              <Badge variant="secondary" className="text-xs">
                                Χρώμα: {item.variant.color}
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-2xl font-bold text-white mt-2">
                          €{item.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                          className="h-8 w-8 p-0 border-gray-600 text-white hover:bg-gray-700"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-white font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          className="h-8 w-8 p-0 border-gray-600 text-white hover:bg-gray-700"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id, item.variant)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
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
                    <div className="flex justify-between text-white text-lg font-bold">
                      <span>Σύνολο</span>
                      <span>€{totals.total}</span>
                    </div>
                  </div>

                  {totals.shipping === 0 && (
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                      <p className="text-green-400 text-sm text-center">
                        🎉 Κερδίσατε δωρεάν μεταφορικά!
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button 
                        className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                        disabled={isLoading}
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
