export default function PaymentPage() {
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">Τρόποι Πληρωμής</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">
            Επιλέξτε τον τρόπο πληρωμής που προτιμάτε για την παραγγελία σας
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Credit/Debit Cards */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">ΧΡΕΩΣΤΙΚΗ/ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  Μπορείς να εξοφλήσεις την παραγγελία σου μέσω πιστωτικής ή χρεωστικής κάρτας Visa, MasterCard,
                  Maestro, Diners Club και Discover.
                </p>
              </div>

              {/* Security */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">ΑΣΦΑΛΕΙΑ ΣΥΝΑΛΛΑΓΩΝ</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  Όλες οι πληρωμές που πραγματοποιούνται με χρήση κάρτας διεκπεραιώνονται μέσω της πλατφόρμας
                  ηλεκτρονικών συναλλαγών "Nexi E-Commerce" της Nexi Payments Greece S.A. και χρησιμοποιεί κρυπτογράφηση
                  TLS 1.2 με πρωτόκολλο κρυπτογράφησης 128 bit (Secure Sockets Layer – SSL). Η κρυπτογράφηση είναι ένας
                  τρόπος κωδικοποίησης της πληροφορίας μέχρι αυτή να φτάσει στον ορισμένο αποδέκτη της, ο οποίος θα
                  μπορέσει να την αποκωδικοποιήσει με χρήση του κατάλληλου κλειδιού.
                </p>
              </div>

              {/* PayPal */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">PAYPAL</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  Μπορείς να εξοφλήσεις την παραγγελία σου μέσω του ασφαλούς περιβάλλοντος πληρωμών PayPal
                  χρησιμοποιώντας τον λογαριασμό σου.
                </p>
              </div>

              {/* Bank Transfer */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">ΚΑΤΑΘΕΣΗ ΣΕ ΤΡΑΠΕΖΙΚΟ ΛΟΓΑΡΙΑΣΜΟ</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>Μπορείς να εξοφλήσεις την παραγγελία σου μέσω κατάθεσης στον παρακάτω τραπεζικό λογαριασμό:</p>
                  <div className="p-6 border rounded-lg bg-blue-900/20 border-blue-700/30">
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
                  <div className="p-6 border rounded-lg bg-red-900/20 border-red-700/30">
                    <p className="font-medium text-red-300">
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
