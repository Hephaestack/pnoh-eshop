import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Footer() {
  return (
    <>
      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4">Μείνετε Ενημερωμένοι</h2>
          <p className="text-gray-300 mb-8 font-light">
            Εγγραφείτε στο newsletter μας για να μαθαίνετε πρώτοι για τις νέες συλλογές
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Το email σας"
              className="flex-1 bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-white transition-colors"
            />
            <Button className="bg-white text-black hover:bg-gray-100 px-8 font-light tracking-wide">ΕΓΓΡΑΦΗ</Button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light tracking-wider text-black mb-3">Πνοή</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed mb-4">
                  Εκλεπτυσμένα κοσμήματα που συνδυάζουν παράδοση και σύγχρονο design.
                </p>
                <p className="text-gray-600 text-sm font-light">pnoi@yahoo.gr</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-black tracking-wide">ΠΛΟΗΓΗΣΗ</h4>
              <div className="space-y-3">
                <Link href="/" className="block text-sm text-gray-600 hover:text-black transition-colors font-light">
                  ΚΟΣΜΗΜΑΤΑ
                </Link>
                <Link
                  href="/collections"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  ΠΟΙΟΙ ΕΙΜΑΣΤΕ
                </Link>
                <Link
                  href="/rings"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  ΕΠΙΚΟΙΝΩΝΙΑ
                </Link>
              </div>
            </div>

           

            {/* Legal & Policies */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-black tracking-wide">ΠΛΗΡΟΦΟΡΙΕΣ</h4>
              <div className="space-y-3">
                <Link
                  href="/privacy-policy"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Πολιτική Απορρήτου
                </Link>
                <Link
                  href="/terms-conditions"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Όροι & Προϋποθέσεις
                </Link>
                <Link
                  href="/returns"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Πολιτική Επιστροφών
                </Link>
                <Link
                  href="/shipping"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Τρόποι Αποστολής
                </Link>
                <Link
                  href="/payments"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Τρόποι Πληρωμής
                </Link>
                <div className="pt-4 space-y-2">
                  <p className="text-sm text-gray-600 font-light">
                    <strong>Τηλέφωνο:</strong>
                    <br />
                    +30 210 123 4567
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    <strong>Διεύθυνση:</strong>
                    <br />
                    Οδός Ιωάννου Δροσοπούλου 63, 
                    <br />
                    Κυψέλη, Αθήνα
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-100 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-sm text-gray-600 font-light">© 2025 Πνοή. Όλα τα δικαιώματα διατηρούνται.</div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-light">Δεχόμαστε:</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium text-gray-700">VISA</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium text-gray-700">MASTERCARD</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium text-gray-700">PAYPAL</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium text-gray-700">APPLE PAY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
