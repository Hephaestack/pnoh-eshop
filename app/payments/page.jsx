export default function PaymentPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black mb-4">Τρόποι Πληρωμής</h1>
          <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Επιλέξτε τον τρόπο πληρωμής που προτιμάτε για την παραγγελία σας
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Credit/Debit Cards */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">ΧΡΕΩΣΤΙΚΗ/ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light leading-relaxed">
                  Μπορείς να εξοφλήσεις την παραγγελία σου μέσω πιστωτικής ή χρεωστικής κάρτας Visa, MasterCard,
                  Maestro, Diners Club και Discover.
                </p>
              </div>

              {/* Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">ΑΣΦΑΛΕΙΑ ΣΥΝΑΛΛΑΓΩΝ</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light leading-relaxed">
                  Όλες οι πληρωμές που πραγματοποιούνται με χρήση κάρτας διεκπεραιώνονται μέσω της πλατφόρμας
                  ηλεκτρονικών συναλλαγών "Nexi E-Commerce" της Nexi Payments Greece S.A. και χρησιμοποιεί κρυπτογράφηση
                  TLS 1.2 με πρωτόκολλο κρυπτογράφησης 128 bit (Secure Sockets Layer – SSL). Η κρυπτογράφηση είναι ένας
                  τρόπος κωδικοποίησης της πληροφορίας μέχρι αυτή να φτάσει στον ορισμένο αποδέκτη της, ο οποίος θα
                  μπορέσει να την αποκωδικοποιήσει με χρήση του κατάλληλου κλειδιού.
                </p>
              </div>

              {/* PayPal */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">PAYPAL</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light leading-relaxed">
                  Μπορείς να εξοφλήσεις την παραγγελία σου μέσω του ασφαλούς περιβάλλοντος πληρωμών PayPal
                  χρησιμοποιώντας τον λογαριασμό σου.
                </p>
              </div>

              {/* Bank Transfer */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">ΚΑΤΑΘΕΣΗ ΣΕ ΤΡΑΠΕΖΙΚΟ ΛΟΓΑΡΙΑΣΜΟ</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>Μπορείς να εξοφλήσεις την παραγγελία σου μέσω κατάθεσης στον παρακάτω τραπεζικό λογαριασμό:</p>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p>
                      <strong>Δικαιούχος:</strong> ΣΕΡΒΟΣ ΜΙΧΑΗΛ
                    </p>
                    <p>
                      <strong>Τράπεζα:</strong> ALPHA BANK
                    </p>
                    <p>
                      <strong>IBAN:</strong> GR 160 140 4050 4050 0200 2018 725
                    </p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <p className="text-red-700 font-medium">
                      (!) Η τραπεζική κατάθεση θα πρέπει να πραγματοποιηθεί εντός 24 ωρών από την καταχώρηση της
                      παραγγελίας. Το αποδεικτικό της κατάθεσης θα πρέπει να αποσταλεί με email στο pnoi3@yahoo.gr. Εάν
                      η κατάθεση των χρημάτων δεν πραγματοποιηθεί εντός 24 ωρών η παραγγελία ακυρώνεται αυτόματα, χωρίς
                      προειδοποίηση.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
