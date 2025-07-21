import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Heart, Gem } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black mb-4">Σχετικά με εμάς</h1>
          <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Η ιστορία μας, οι αξίες μας και το πάθος μας για τη δημιουργία εξαιρετικών κοσμημάτων.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black">Η Ιστορία μας</h2>
              <div className="w-16 h-px bg-gray-400"></div>
              <p className="text-gray-600 leading-relaxed font-light">
                Για πάνω από 15 χρόνια, η ΠΝΟΗ είναι γεμάτη ατελείωτες στιγμές και αναμνήσεις. H αγάπη μας για τα κοσμήματα κι ειδικά για το χειροποίητο, είναι ο λόγος που αποφασίσαμε να δημιουργήσουμε το εργαστήρι μας.
Ήταν πολύ εύκολο να επιλέξουμε το όνομα. Αβίαστο. Έχουμε μεγαλώσει στην Κυψέλη, μια περιοχή πολύπαθη η οποία περιβάλλεται από υπέροχα αρχιτεκτονικά επιτεύγματα και αντικατοπτρίζει την καθαρή αστική γειτονιά. Αυτό θέλαμε να αναδείξουμε, με ένα πιο φρέσκο αέρα, μια άλλη πνοή, αλλά κρατώντας αυτή την αρχοντιά της περιοχής.
Δίνουμε τεράστια βάση στην έννοια χειροποίητο, αναδεικνύοντας την ατέλεια που δίνουν τα χέρια, αλλά και μεγάλη προσοχή στα υλικά μας. Αυτός είναι και ο λόγος που επιλέξαμε ασήμι 925 & ημιπολύτιμους λίθους για τα προϊόντα μας. Επιπλέον, θέλουμε να έχουμε μεγάλη ποικιλία από στιλ καθώς η κοινότητα ΠΝΟΗ, εκφράζει τη διαφορετικότητά της με πολλές επιλογές, καινούργιες τεχνικές, χρώματα και σχέδια, ενώ διατηρούμε την υψηλή ποιότητα που προσφέρουν τα προϊόντα μας.
Ακολουθήστε μας και απολαύστε τη διαδρομή.
              </p>
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white transition-all duration-300 bg-transparent"
              >
                ΜΑΘΕΤΕ ΠΕΡΙΣΣΟΤΕΡΑ
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Jewelry workshop"
                width={400}
                height={500}
                className="w-full h-96 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-gray-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black mb-4">Οι Αξίες μας</h2>
            <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              Αυτό που μας καθοδηγεί στη δημιουργία κάθε κοσμήματος
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Gem,
                title: "Ποιότητα",
                description: "Χρησιμοποιούμε μόνο τα καλύτερα υλικά και τεχνικές για κάθε δημιουργία μας.",
              },
              {
                icon: Heart,
                title: "Πάθος",
                description: "Κάθε κόσμημα δημιουργείται με αγάπη και προσοχή στη λεπτομέρεια.",
              },
              {
                icon: Award,
                title: "Αριστεία",
                description: "Στοχεύουμε στην τελειότητα σε κάθε πτυχή της δουλειάς μας.",
              },
              {
                icon: Users,
                title: "Εξυπηρέτηση",
                description: "Οι πελάτες μας είναι στο κέντρο όλων όσων κάνουμε.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <value.icon className="w-12 h-12 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-light text-black mb-4 tracking-wide">{value.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black mb-4">Η Ομάδα μας</h2>
            <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              Γνωρίστε τους ανθρώπους πίσω από κάθε δημιουργία
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "[Όνομα Μέλους Ομάδας]",
                role: "[Θέση/Ρόλος]",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "[Όνομα Μέλους Ομάδας]",
                role: "[Θέση/Ρόλος]",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "[Όνομα Μέλους Ομάδας]",
                role: "[Θέση/Ρόλος]",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-light text-black mb-2 tracking-wide">{member.name}</h3>
                    <p className="text-gray-600 text-sm font-light">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black mb-4">Η Διαδικασία μας</h2>
            <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">Από την ιδέα στο τελικό κόσμημα</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Σχεδιασμός",
                description: "[Περιγράψτε τη διαδικασία σχεδιασμού]",
              },
              {
                step: "02",
                title: "Επιλογή Υλικών",
                description: "[Περιγράψτε την επιλογή υλικών]",
              },
              {
                step: "03",
                title: "Κατασκευή",
                description: "[Περιγράψτε τη διαδικασία κατασκευής]",
              },
              {
                step: "04",
                title: "Τελειοποίηση",
                description: "[Περιγράψτε την τελική επεξεργασία]",
              },
            ].map((process, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="text-4xl font-extralight text-gray-400 mb-4">{process.step}</div>
                <h3 className="text-xl font-light text-black tracking-wide">{process.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-black mb-4">
            Έτοιμοι να δημιουργήσουμε κάτι μοναδικό μαζί;
          </h2>
          <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto">
            Επικοινωνήστε μαζί μας για να συζητήσουμε τις ιδέες σας και να δημιουργήσουμε το τέλειο κόσμημα για εσάς.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-light tracking-wide transition-all duration-300"
            >
              ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-black hover:bg-gray-50 px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 bg-transparent"
            >
              ΔΕΙΤΕ ΤΗ ΣΥΛΛΟΓΗ
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
