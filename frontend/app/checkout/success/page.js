"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Package, CreditCard, Building } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentType = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');
  const [orderNumber] = useState(() => 
    sessionId ? sessionId.replace('cs_', 'PN-').toUpperCase() : 
    Math.random().toString(36).substr(2, 9).toUpperCase()
  );

  const isCardPayment = !paymentType || paymentType === 'card';
  const isBankTransfer = paymentType === 'bank_transfer';
  const isStripeSuccess = sessionId && sessionId.startsWith('cs_');

  useEffect(() => {
    // Clear any checkout data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pnoh-checkout-storage');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#18181b] py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </motion.div>

          {/* Title & Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              {isCardPayment ? 'Ευχαριστούμε για την παραγγελία σας!' : 'Η παραγγελία σας καταχωρήθηκε!'}
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Αριθμός παραγγελίας: <span className="font-mono font-bold">#{orderNumber}</span>
            </p>
            {isCardPayment ? (
              <p className="text-gray-400">
                Η πληρωμή σας επεξεργάστηκε επιτυχώς και θα λάβετε email επιβεβαίωσης σύντομα.
              </p>
            ) : (
              <p className="text-gray-400">
                Θα προχωρήσουμε στην επεξεργασία μόλις λάβουμε την πληρωμή σας.
              </p>
            )}
          </motion.div>

          {/* Order Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {/* Payment Status */}
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center space-x-2">
                  {isCardPayment ? (
                    <CreditCard className="w-5 h-5" />
                  ) : (
                    <Building className="w-5 h-5" />
                  )}
                  <span>Κατάσταση Πληρωμής</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isCardPayment ? (
                    <>
                      <Badge className="bg-green-600 text-white">
                        Πληρωμή Ολοκληρώθηκε
                      </Badge>
                      <p className="text-sm text-gray-400">
                        Η πληρωμή με κάρτα επεξεργάστηκε επιτυχώς
                      </p>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="bg-yellow-600 text-white">
                        Αναμονή Πληρωμής
                      </Badge>
                      <p className="text-sm text-gray-400">
                        Παρακαλώ πραγματοποιήστε την τραπεζική κατάθεση
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Status */}
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Κατάσταση Αποστολής</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="outline" className="border-gray-500 text-gray-300">
                    Προετοιμασία Παραγγελίας
                  </Badge>
                  <p className="text-sm text-gray-400">
                    Θα ειδοποιηθείτε όταν η παραγγελία σας αποσταλεί
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Transfer Instructions */}
          {isBankTransfer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card className="bg-[#232326] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Οδηγίες Τραπεζικής Κατάθεσης</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-left space-y-4">
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
                          <span className="text-white ml-2">Παραγγελία #{orderNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                      <p className="text-yellow-400 text-sm">
                        📧 Στείλτε το αποδεικτικό κατάθεσης στο: <strong>orders@pnoh.gr</strong>
                      </p>
                      <p className="text-yellow-400 text-sm mt-2">
                        ⏰ Η παραγγελία θα αποσταλεί εντός 1-2 εργάσιμων ημερών από την επιβεβαίωση της πληρωμής
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Τι Ακολουθεί;</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Email Επιβεβαίωσης</h4>
                      <p className="text-gray-400 text-sm">
                        Θα λάβετε email με όλες τις λεπτομέρειες της παραγγελίας σας
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Προετοιμασία & Αποστολή</h4>
                      <p className="text-gray-400 text-sm">
                        {isCardPayment 
                          ? 'Θα προετοιμάσουμε την παραγγελία σας εντός 1-2 εργάσιμων ημερών'
                          : 'Μόλις επιβεβαιωθεί η πληρωμή, θα προετοιμάσουμε την παραγγελία σας'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Download className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Παρακολούθηση Αποστολής</h4>
                      <p className="text-gray-400 text-sm">
                        Θα λάβετε αριθμό παρακολούθησης όταν η παραγγελία αποσταλεί
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/collections">
              <Button className="bg-white text-black hover:bg-gray-100">
                Συνέχεια Αγορών
              </Button>
            </Link>
            
            <Link href="/account">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                Προβολή Παραγγελιών
              </Button>
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400 text-sm">
              Χρειάζεστε βοήθεια; Επικοινωνήστε μαζί μας στο{' '}
              <a href="mailto:support@pnoh.gr" className="text-blue-400 hover:underline">
                support@pnoh.gr
              </a>
              {' '}ή τηλεφωνήστε στο{' '}
              <a href="tel:+302101234567" className="text-blue-400 hover:underline">
                210 123 4567
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
