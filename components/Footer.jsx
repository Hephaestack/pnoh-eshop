import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Footer() {
  return (
    <>

      
      {/* Main Footer */}
      <footer className="pt-16 pb-10 bg-[#18181b] border-t-2 border-[#bfc1c6]">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center w-full gap-12 lg:grid lg:grid-cols-4 lg:items-start lg:justify-center">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-2xl font-light tracking-wider text-[#e5e7eb]" style={{ textShadow: '0 0 8px #bfc1c6' }}>Πνοή</h3>
                <p className="mb-4 text-sm font-light leading-relaxed text-[#bfc1c6]">
                  Εκλεπτυσμένα κοσμήματα που συνδυάζουν παράδοση και σύγχρονο design.
                </p>
                <p className="text-sm font-light text-[#bfc1c6]">pnoi@yahoo.gr</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium tracking-wide text-[#e5e7eb]">ΠΛΟΗΓΗΣΗ</h4>
              <div className="space-y-3">
                <Link href="/" className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white">
                  ΚΟΣΜΗΜΑΤΑ
                </Link>
                <Link
                  href="/collections"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  ΠΟΙΟΙ ΕΙΜΑΣΤΕ
                </Link>
                <Link
                  href="/rings"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  ΕΠΙΚΟΙΝΩΝΙΑ
                </Link>
              </div>
            </div>

            {/* Legal & Policies */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium tracking-wide text-[#e5e7eb]">ΠΛΗΡΟΦΟΡΙΕΣ</h4>
              <div className="space-y-3">
                <Link
                  href="/privacy-policy"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  Πολιτική Απορρήτου
                </Link>
                <Link
                  href="/terms-conditions"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  Όροι & Προϋποθέσεις
                </Link>
                <Link
                  href="/returns"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  Πολιτική Επιστροφών
                </Link>
                <Link
                  href="/shipping"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  Τρόποι Αποστολής
                </Link>
                <Link
                  href="/payments"
                  className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
                >
                  Τρόποι Πληρωμής
                </Link>
                <div className="pt-4 space-y-2">
                  <p className="text-sm font-light text-[#bfc1c6]">
                    <strong>Τηλέφωνο:</strong>
                    <br />
                    +30 210 123 4567
                  </p>
                  <p className="text-sm font-light text-[#bfc1c6]">
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
          <div className="pt-8 mt-16 border-t border-[#bfc1c6] w-full">
            <div className="flex flex-col items-center justify-center w-full gap-6">
              <div className="text-sm font-light text-[#bfc1c6] text-center">© 2025 Πνοή. Όλα τα δικαιώματα διατηρούνται.</div>

              {/* Payment Methods */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-light text-[#bfc1c6]">Δεχόμαστε:</span>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 text-xs font-medium text-[#23232a] bg-[#bfc1c6] rounded">VISA</div>
                  <div className="px-3 py-1 text-xs font-medium text-[#23232a] bg-[#bfc1c6] rounded">MASTERCARD</div>
                  <div className="px-3 py-1 text-xs font-medium text-[#23232a] bg-[#bfc1c6] rounded">PAYPAL</div>
                  <div className="px-3 py-1 text-xs font-medium text-[#23232a] bg-[#bfc1c6] rounded">APPLE PAY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
