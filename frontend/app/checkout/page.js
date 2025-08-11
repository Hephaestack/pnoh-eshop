"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Truck, User, Lock } from 'lucide-react';
import Link from 'next/link';

import useCartStore from '@/lib/store/cart';
import useCheckoutStore from '@/lib/store/checkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Step Components
import ShippingStep from '@/components/checkout/ShippingStep';
import BillingStep from '@/components/checkout/BillingStep';
import ShippingMethodStep from '@/components/checkout/ShippingMethodStep';
import PaymentStep from '@/components/checkout/PaymentStep';

const steps = [
  { number: 1, title: 'Στοιχεία Αποστολής', icon: User },
  { number: 2, title: 'Στοιχεία Χρέωσης', icon: CreditCard },
  { number: 3, title: 'Μέθοδος Αποστολής', icon: Truck },
  { number: 4, title: 'Πληρωμή', icon: Lock }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);

  const { items, getTotals } = useCartStore();
  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    validateStep,
    isProcessing
  } = useCheckoutStore();

  const totals = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  if (!isLoaded || !mounted) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingStep />;
      case 2:
        return <BillingStep />;
      case 3:
        return <ShippingMethodStep />;
      case 4:
        return <PaymentStep />;
      default:
        return <ShippingStep />;
    }
  };

  const isStepValid = validateStep(currentStep);
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#18181b] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" className="text-white hover:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Επιστροφή στο Καλάθι
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Ολοκλήρωση Παραγγελίας
            </h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            Βήμα {currentStep} από {steps.length}
          </Badge>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div
                  key={step.number}
                  className={`flex items-center space-x-2 ${
                    isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isActive
                        ? 'border-white bg-white text-black'
                        : isCompleted
                        ? 'border-green-400 bg-green-400 text-black'
                        : 'border-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between mt-8"
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isProcessing}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Προηγούμενο
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid || isProcessing}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Επόμενο
                </Button>
              ) : (
                <Button
                  disabled={!isStepValid || isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? 'Επεξεργασία...' : 'Ολοκλήρωση Παραγγελίας'}
                </Button>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
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
                <CardContent>
                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.variant?.size || ''}-${item.variant?.color || ''}`}
                        className="flex items-center space-x-3"
                      >
                        <div className="relative">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {item.name}
                          </p>
                          {item.variant && (
                            <p className="text-gray-400 text-xs">
                              {item.variant.size && `${item.variant.size} `}
                              {item.variant.color && `• ${item.variant.color}`}
                            </p>
                          )}
                        </div>
                        <p className="text-white text-sm font-semibold">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Υποσύνολο</span>
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
                </CardContent>
              </Card>

              {/* Security Badge */}
              <Card className="bg-[#232326] border-gray-700 mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Ασφαλής Πληρωμή SSL</span>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Τα στοιχεία σας προστατεύονται με κρυπτογράφηση 256-bit
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
