export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black mb-4">Πολιτική Απορρήτου</h1>
          <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Η προστασία των προσωπικών σας δεδομένων είναι σημαντική για εμάς
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Last Updated */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p className="text-sm text-gray-600 font-light mb-0">
                  <strong>Τελευταία ενημέρωση:</strong> Ιανουάριος 2024
                </p>
              </div>

              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">Εισαγωγή</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>
                    Η εταιρεία "ΠΝΟΗ χειροποίητο κόσμημα" με έδρα στην Κυψέλη, Οδός Ιωάννου Δροσοπούλου 63, ΑΦΜ
                    129517325, δεσμεύεται για την προστασία των προσωπικών δεδομένων των χρηστών του ιστότοπου
                    pnoikosmima.com.
                  </p>
                  <p>
                    Η παρούσα Πολιτική Απορρήτου περιγράφει τον τρόπο με τον οποίο συλλέγουμε, χρησιμοποιούμε,
                    αποθηκεύουμε και προστατεύουμε τα προσωπικά σας δεδομένα σύμφωνα με τον Γενικό Κανονισμό Προστασίας
                    Δεδομένων (GDPR) και την ελληνική νομοθεσία.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">1. Συλλογή Προσωπικών Δεδομένων</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>Συλλέγουμε προσωπικά δεδομένα όταν:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Δημιουργείτε λογαριασμό στον ιστότοπό μας</li>
                    <li>Πραγματοποιείτε παραγγελία</li>
                    <li>Εγγράφεστε στο newsletter μας</li>
                    <li>Επικοινωνείτε μαζί μας μέσω φόρμας επικοινωνίας</li>
                  </ul>
                  <p>Τα δεδομένα που συλλέγουμε περιλαμβάνουν:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Ονοματεπώνυμο</li>
                    <li>Διεύθυνση email</li>
                    <li>Τηλέφωνο</li>
                    <li>Διεύθυνση αποστολής και χρέωσης</li>
                    <li>Στοιχεία παραγγελίας</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">2. Χρήση Προσωπικών Δεδομένων</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>Χρησιμοποιούμε τα προσωπικά σας δεδομένα για:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Επεξεργασία και εκτέλεση των παραγγελιών σας</li>
                    <li>Επικοινωνία σχετικά με τις παραγγελίες σας</li>
                    <li>Παροχή εξυπηρέτησης πελατών</li>
                    <li>Αποστολή ενημερωτικών email (με τη συγκατάθεσή σας)</li>
                    <li>Βελτίωση των υπηρεσιών μας</li>
                    <li>Συμμόρφωση με νομικές υποχρεώσεις</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">3. Κοινοποίηση σε Τρίτους</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>Δεν πωλούμε, ενοικιάζουμε ή μοιραζόμαστε τα προσωπικά σας δεδομένα με τρίτους, εκτός από:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Εταιρείες ταχυμεταφορών (Box Now, Γενική Ταχυδρομική) για την παράδοση των παραγγελιών</li>
                    <li>Παρόχους υπηρεσιών πληρωμών (Nexi E-Commerce, PayPal) για την επεξεργασία πληρωμών</li>
                    <li>Όταν απαιτείται από το νόμο ή δικαστική απόφαση</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">4. Ασφάλεια Δεδομένων</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>
                    Λαμβάνουμε κατάλληλα τεχνικά και οργανωτικά μέτρα για την προστασία των προσωπικών σας δεδομένων:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Κρυπτογράφηση SSL για την ασφαλή μεταφορά δεδομένων</li>
                    <li>Ασφαλή αποθήκευση σε προστατευμένους διακομιστές</li>
                    <li>Περιορισμένη πρόσβαση μόνο σε εξουσιοδοτημένο προσωπικό</li>
                    <li>Τακτικές ενημερώσεις ασφαλείας</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">5. Δικαιώματα Υποκειμένων</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>Έχετε τα ακόλουθα δικαιώματα σχετικά με τα προσωπικά σας δεδομένα:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Δικαίωμα πρόσβασης:</strong> Να ζητήσετε πληροφορίες για τα δεδομένα που επεξεργαζόμαστε
                    </li>
                    <li>
                      <strong>Δικαίωμα διόρθωσης:</strong> Να ζητήσετε διόρθωση ανακριβών δεδομένων
                    </li>
                    <li>
                      <strong>Δικαίωμα διαγραφής:</strong> Να ζητήσετε διαγραφή των δεδομένων σας
                    </li>
                    <li>
                      <strong>Δικαίωμα φορητότητας:</strong> Να λάβετε τα δεδομένα σας σε δομημένη μορφή
                    </li>
                    <li>
                      <strong>Δικαίωμα αντίρρησης:</strong> Να αντιταχθείτε στην επεξεργασία
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-12">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">6. Cookies</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                  <p>
                    Ο ιστότοπός μας χρησιμοποιεί cookies για τη βελτίωση της εμπειρίας χρήσης. Για περισσότερες
                    πληροφορίες, ανατρέξτε στην{" "}
                    <a href="/cookies-policy" className="text-black hover:underline">
                      Πολιτική Cookies
                    </a>{" "}
                    μας.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-light tracking-wide text-black mb-6">Επικοινωνία</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <div className="space-y-2 text-gray-600 font-light">
                  <p>Για οποιαδήποτε ερώτηση σχετικά με την πολιτική απορρήτου μας, επικοινωνήστε μαζί μας:</p>
                  <p>
                    <strong>Email:</strong> pnoi@yahoo.gr
                  </p>
                  <p>
                    <strong>Διεύθυνση:</strong> Οδός Ιωάννου Δροσοπούλου 63, Κυψέλη, Αθήνα
                  </p>
                  <p>
                    <strong>ΑΦΜ:</strong> 129517325
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
