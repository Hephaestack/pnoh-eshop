export default function ShippingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black mb-4">Τρόποι Αποστολής</h1>
          <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Επιλέξτε τον τρόπο αποστολής που σας εξυπηρετεί καλύτερα
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Box Now */}
              <div className="mb-8">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">Box Now</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light leading-relaxed">
                  Οι παραδόσεις των παραγγελιών αποστέλλονται μέσω της εταιρείας ταχυμεταφορών (courier) Box Now εντός
                  1-2 εργάσιμων ημερών. Τα έξοδα αποστολής είναι 2€
                </p>
              </div>

              {/* Γενική Ταχυδρομική */}
              <div className="mb-8">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">Γενική Ταχυδρομική</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light leading-relaxed">
                  Οι παραδόσεις των παραγγελιών αποστέλλονται μέσω της εταιρείας ταχυμεταφορών (courier) Γενική
                  ταχυδρομική εντός 1-2 εργάσιμων ημερών. Τα έξοδα αποστολής είναι 10€.
                </p>
              </div>

              {/* Free Shipping */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-green-700 font-light text-center">
                  <strong>
                    Για όλους τους τρόπους αποστολής ισχύει ότι για παραγγελίες άνω των 150€ τα έξοδα αποστολής είναι
                    δωρεάν.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
