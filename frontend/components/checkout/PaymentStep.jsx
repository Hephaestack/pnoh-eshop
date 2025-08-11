"use client";

import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building, Lock, AlertCircle } from 'lucide-react';

import useCheckoutStore from '@/lib/store/checkout';
import useCartStore from '@/lib/store/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Initialize Stripe (no longer needed for Stripe Checkout)
// Stripe Checkout is hosted by Stripe and handles all payment processing

const paymentMethods = [
  {
    id: 'card',
    name: 'Πιστωτική/Χρεωστική Κάρτα',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    popular: true,
    fees: 0
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Πληρώστε με τον λογαριασμό σας PayPal',
    icon: Smartphone,
    popular: false,
    fees: 0
  },
  {
    id: 'bank_transfer',
    name: 'Τραπεζική Κατάθεση',
    description: 'Κατάθεση σε τραπεζικό λογαριασμό',
    icon: Building,
    popular: false,
    fees: 0,
    note: 'Η παραγγελία θα αποσταλεί μετά την επιβεβαίωση της πληρωμής'
  }
];

export default function PaymentStep() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    paymentMethod,
    setPaymentMethod,
    shippingInfo,
    billingInfo,
    shippingMethod,
    setProcessing,
    resetCheckout
  } = useCheckoutStore();
  
  const { items, getTotals, clearCart } = useCartStore();
  const totals = getTotals();

  const handlePayment = async () => {
    if (!acceptTerms) {
      alert('Παρακαλώ αποδεχτείτε τους όρους χρήσης για να συνεχίσετε');
      return;
    }

    setIsProcessing(true);
    setProcessing(true);

    try {
      if (paymentMethod === 'card') {
        await handleCardPayment();
      } else if (paymentMethod === 'paypal') {
        await handlePayPalPayment();
      } else if (paymentMethod === 'bank_transfer') {
        await handleBankTransfer();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Υπήρξε πρόβλημα με την πληρωμή. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsProcessing(false);
      setProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    // Create Stripe Checkout Session on your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(totals.total * 100), // Convert to cents
        currency: 'eur',
        items,
        shippingInfo,
        billingInfo,
        shippingMethod
      }),
    });

    const { url, sessionId } = await response.json();

    if (url) {
      // Redirect to Stripe Checkout
      window.location.href = url;
    } else {
      throw new Error('Failed to create checkout session');
    }
  };

  const handlePayPalPayment = async () => {
    // Implement PayPal payment logic
    console.log('PayPal payment');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success
    clearCart();
    resetCheckout();
    window.location.href = '/checkout/success';
  };

  const handleBankTransfer = async () => {
    // Create order with bank transfer payment method
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        shippingInfo,
        billingInfo,
        shippingMethod,
        paymentMethod: 'bank_transfer',
        total: totals.total
      }),
    });

    if (response.ok) {
      clearCart();
      resetCheckout();
      window.location.href = '/checkout/success?payment=bank_transfer';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card className="bg-[#232326] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Επιλογή Μεθόδου Πληρωμής</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            {paymentMethods.map((method) => {
              const Icon = method.icon;

              return (
                <div
                  key={method.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-white bg-[#18181b]'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      className="border-gray-400 text-white"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={method.id}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-300" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-white font-medium">{method.name}</h3>
                              {method.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Δημοφιλής
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{method.description}</p>
                            {method.note && (
                              <p className="text-yellow-400 text-xs mt-1 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {method.note}
                              </p>
                            )}
                          </div>
                        </div>
                        {method.fees > 0 && (
                          <span className="text-white font-semibold">+€{method.fees}</span>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Bank Transfer Details */}
      {paymentMethod === 'bank_transfer' && (
        <Card className="bg-[#232326] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Στοιχεία Τραπεζικού Λογαριασμού</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#18181b] border border-gray-600 rounded-lg p-4">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Τράπεζα:</span>
                  <span className="text-white ml-2">Εθνική Τράπεζα Ελλάδος</span>
                </div>
                <div>
                  <span className="text-gray-400">Δικαιούχος:</span>
                  <span className="text-white ml-2">Πνοή - Εργαστήρι Κοσμήματος</span>
                </div>
                <div>
                  <span className="text-gray-400">IBAN:</span>
                  <span className="text-white ml-2 font-mono">GR00 0000 0000 0000 0000 0000 000</span>
                </div>
                <div>
                  <span className="text-gray-400">Αιτιολογία:</span>
                  <span className="text-white ml-2">Παραγγελία #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Παρακαλώ στείλτε το αποδεικτικό κατάθεσης στο email: orders@pnoh.gr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card className="bg-[#232326] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Τελική Επισκόπηση Παραγγελίας</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Shipping & Billing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-white font-medium mb-2">Αποστολή στο:</h4>
                <div className="text-gray-300 space-y-1">
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                  <p>{shippingInfo.country}</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Χρέωση στο:</h4>
                <div className="text-gray-300 space-y-1">
                  {billingInfo.sameAsShipping ? (
                    <p className="text-gray-400 italic">Ίδια στοιχεία με αποστολή</p>
                  ) : (
                    <>
                      <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                      <p>{billingInfo.address}</p>
                      <p>{billingInfo.city}, {billingInfo.postalCode}</p>
                      <p>{billingInfo.country}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Final Totals */}
            <div className="border-t border-gray-600 pt-4">
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
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Τελικό Σύνολο</span>
                  <span>€{totals.total}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Complete Order */}
      <Card className="bg-[#232326] border-gray-700">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                className="border-gray-600 text-white data-[state=checked]:bg-white data-[state=checked]:text-black mt-1"
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-300 cursor-pointer">
                Αποδέχομαι τους{' '}
                <a href="/terms-conditions" className="text-blue-400 hover:underline">
                  όρους χρήσης
                </a>{' '}
                και την{' '}
                <a href="/privacy-policy" className="text-blue-400 hover:underline">
                  πολιτική απορρήτου
                </a>
              </Label>
            </div>

            {/* Complete Order Button */}
            <Button
              onClick={handlePayment}
              disabled={!acceptTerms || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
              size="lg"
            >
              <Lock className="w-5 h-5 mr-2" />
              {isProcessing ? 'Επεξεργασία Παραγγελίας...' : `Ολοκλήρωση Παραγγελίας - €${totals.total}`}
            </Button>

            {/* Security Info */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Η πληρωμή σας προστατεύεται με κρυπτογράφηση SSL 256-bit</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
