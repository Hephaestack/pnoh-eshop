"use client";

import { useState } from 'react';
import { Truck, Clock, Zap } from 'lucide-react';

import useCheckoutStore from '@/lib/store/checkout';
import useCartStore from '@/lib/store/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const shippingMethods = [
  {
    id: 'standard',
    name: 'Κανονική Αποστολή',
    description: 'Παράδοση σε 3-5 εργάσιμες ημέρες',
    price: 5,
    freeThreshold: 50,
    icon: Truck,
    estimatedDays: '3-5 ημέρες'
  },
  {
    id: 'express',
    name: 'Ταχεία Αποστολή',
    description: 'Παράδοση σε 1-2 εργάσιμες ημέρες',
    price: 12,
    freeThreshold: null,
    icon: Zap,
    estimatedDays: '1-2 ημέρες'
  },
  {
    id: 'overnight',
    name: 'Επόμενη Εργάσιμη',
    description: 'Παράδοση την επόμενη εργάσιμη ημέρα',
    price: 25,
    freeThreshold: null,
    icon: Clock,
    estimatedDays: '1 ημέρα'
  }
];

export default function ShippingMethodStep() {
  const { shippingMethod, setShippingMethod, shippingInfo } = useCheckoutStore();
  const { getTotals } = useCartStore();
  
  const totals = getTotals();
  const isInternational = shippingInfo.country !== 'Greece';

  // Filter shipping methods based on destination
  const availableMethods = shippingMethods.filter(method => {
    if (isInternational && method.id === 'overnight') {
      return false; // No overnight shipping for international
    }
    return true;
  });

  const calculateShippingCost = (method) => {
    if (method.freeThreshold && totals.subtotal >= method.freeThreshold) {
      return 0;
    }
    
    // Add international surcharge
    let cost = method.price;
    if (isInternational) {
      cost += 10;
    }
    
    return cost;
  };

  const getEstimatedDelivery = (method) => {
    if (isInternational) {
      const baseDays = method.id === 'standard' ? '5-8' : '3-5';
      return `${baseDays} ημέρες`;
    }
    return method.estimatedDays;
  };

  return (
    <Card className="bg-[#232326] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Επιλογή Μεθόδου Αποστολής</CardTitle>
        {isInternational && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-blue-400 text-sm">
              📦 Διεθνής αποστολή - προστίθεται επιπλέον κόστος €10
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={shippingMethod}
          onValueChange={setShippingMethod}
          className="space-y-4"
        >
          {availableMethods.map((method) => {
            const Icon = method.icon;
            const cost = calculateShippingCost(method);
            const estimatedDelivery = getEstimatedDelivery(method);
            const isFree = cost === 0 && method.freeThreshold;

            return (
              <div
                key={method.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  shippingMethod === method.id
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
                          <h3 className="text-white font-medium">{method.name}</h3>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {estimatedDelivery}
                            </Badge>
                            {isInternational && (
                              <Badge variant="secondary" className="text-xs">
                                Διεθνής
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isFree ? (
                          <div>
                            <span className="text-green-400 font-semibold">Δωρεάν</span>
                            <p className="text-xs text-gray-500 line-through">€{method.price}</p>
                          </div>
                        ) : cost === 0 ? (
                          <span className="text-green-400 font-semibold">Δωρεάν</span>
                        ) : (
                          <span className="text-white font-semibold">€{cost}</span>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>

                {/* Free shipping threshold info */}
                {method.freeThreshold && !isFree && (
                  <div className="mt-3 text-xs text-gray-400">
                    💡 Δωρεάν αποστολή για παραγγελίες άνω των €{method.freeThreshold}
                    {totals.subtotal < method.freeThreshold && (
                      <span className="text-blue-400">
                        {' '}(προσθέστε €{(method.freeThreshold - totals.subtotal).toFixed(2)} ακόμα)
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>

        {/* Delivery Information */}
        <div className="mt-6 bg-[#18181b] border border-gray-600 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Πληροφορίες Παράδοσης</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Παράδοση στη διεύθυνση: {shippingInfo.address}, {shippingInfo.city}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Θα λάβετε email με τον αριθμό παρακολούθησης</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Δυνατότητα παρακολούθησης της παραγγελίας online</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mt-6">
          <Label htmlFor="orderNotes" className="text-white mb-2 block">
            Ειδικές Οδηγίες Παράδοσης (προαιρετικό)
          </Label>
          <textarea
            id="orderNotes"
            placeholder="π.χ. Παράδοση μετά τις 18:00, τηλεφωνήστε πριν την παράδοση..."
            className="w-full px-3 py-2 bg-[#18181b] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-white resize-none"
            rows={3}
            onChange={(e) => useCheckoutStore.getState().setOrderNotes(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
