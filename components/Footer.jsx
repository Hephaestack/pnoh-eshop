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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-light tracking-wider text-black">Πνοή</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Εκλεπτυσμένα κοσμήματα που συνδυάζουν παράδοση και σύγχρονο design.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-black tracking-wide">ΣΥΛΛΟΓΕΣ</h4>
              <div className="space-y-2">
                <Link
                  href="/rings"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Δαχτυλίδια
                </Link>
                <Link
                  href="/necklaces"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Κολιέ
                </Link>
                <Link
                  href="/earrings"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Σκουλαρίκια
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-black tracking-wide">ΥΠΗΡΕΣΙΕΣ</h4>
              <div className="space-y-2">
                <Link
                  href="/contact"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Επικοινωνία
                </Link>
                <Link
                  href="/shipping"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Αποστολές
                </Link>
                <Link
                  href="/returns"
                  className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                >
                  Επιστροφές
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-black tracking-wide">ΕΠΙΚΟΙΝΩΝΙΑ</h4>
              <div className="space-y-2 text-sm text-gray-600 font-light">
                <p>info@pnoe.gr</p>
                <p>+30 210 123 4567</p>
                <p>Αθήνα, Ελλάδα</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-600 font-light">© 2025 Πνοή. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
