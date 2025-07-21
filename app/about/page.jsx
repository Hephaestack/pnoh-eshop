import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Heart, Gem } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">Σχετικά με εμάς</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">
            Η ιστορία μας, οι αξίες μας και το πάθος μας για τη δημιουργία εξαιρετικών κοσμημάτων.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid items-center justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            <div className="flex flex-col items-center space-y-6 lg:items-start">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb]">Η Ιστορία μας</h2>
              <div className="w-16 h-px bg-[#bfc1c6]"></div>
              <p className="text-[#bfc1c6] leading-relaxed font-light">
                Για πάνω από 15 χρόνια, η ΠΝΟΗ είναι γεμάτη ατελείωτες στιγμές και αναμνήσεις. H αγάπη μας για τα κοσμήματα κι ειδικά για το χειροποίητο, είναι ο λόγος που αποφασίσαμε να δημιουργήσουμε το εργαστήρι μας.
Ήταν πολύ εύκολο να επιλέξουμε το όνομα. Αβίαστο. Έχουμε μεγαλώσει στην Κυψέλη, μια περιοχή πολύπαθη η οποία περιβάλλεται από υπέροχα αρχιτεκτονικά επιτεύγματα και αντικατοπτρίζει την καθαρή αστική γειτονιά. Αυτό θέλαμε να αναδείξουμε, με ένα πιο φρέσκο αέρα, μια άλλη πνοή, αλλά κρατώντας αυτή την αρχοντιά της περιοχής.
Δίνουμε τεράστια βάση στην έννοια χειροποίητο, αναδεικνύοντας την ατέλεια που δίνουν τα χέρια, αλλά και μεγάλη προσοχή στα υλικά μας. Αυτός είναι και ο λόγος που επιλέξαμε ασήμι 925 & ημιπολύτιμους λίθους για τα προϊόντα μας. Επιπλέον, θέλουμε να έχουμε μεγάλη ποικιλία από στιλ καθώς η κοινότητα ΠΝΟΗ, εκφράζει τη διαφορετικότητά της με πολλές επιλογές, καινούργιες τεχνικές, χρώματα και σχέδια, ενώ διατηρούμε την υψηλή ποιότητα που προσφέρουν τα προϊόντα μας.
Ακολουθήστε μας και απολαύστε τη διαδρομή.
              </p>
              <Button
                variant="outline"
                className="border-[#bfc1c6] text-[#bfc1c6] hover:bg-[#23232a] hover:text-white hover:border-white transition-all duration-300 bg-transparent"
              >
                ΜΑΘΕΤΕ ΠΕΡΙΣΣΟΤΕΡΑ
              </Button>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Jewelry workshop"
                width={400}
                height={500}
                className="w-full h-96 object-cover grayscale-[30%]"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#bfc1c6] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">Οι Αξίες μας</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
            <p className="text-[#bfc1c6] font-light max-w-2xl mx-auto">
              Αυτό που μας καθοδηγεί στη δημιουργία κάθε κοσμήματος
            </p>
          </div>

          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 text-center bg-[#18181b]"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <value.icon className="w-12 h-12 text-[#bfc1c6]" />
                  </div>
                  <h3 className="text-xl font-light text-[#e5e7eb] mb-4 tracking-wide">{value.title}</h3>
                  <p className="text-[#bfc1c6] font-light leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">Η Ομάδα μας</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
            <p className="text-[#bfc1c6] font-light max-w-2xl mx-auto">
              Γνωρίστε τους ανθρώπους πίσω από κάθε δημιουργία
            </p>
          </div>

          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-3">
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
              <Card key={index} className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 bg-[#23232a]">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover grayscale-[30%]"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-light text-[#e5e7eb] mb-2 tracking-wide">{member.name}</h3>
                    <p className="text-[#bfc1c6] text-sm font-light">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">Η Διαδικασία μας</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
            <p className="text-[#bfc1c6] font-light max-w-2xl mx-auto">Από την ιδέα στο τελικό κόσμημα</p>
          </div>

          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-4">
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
              <div key={index} className="space-y-4 text-center">
                <div className="text-4xl font-extralight text-[#bfc1c6] mb-4">{process.step}</div>
                <h3 className="text-xl font-light text-[#e5e7eb] tracking-wide">{process.title}</h3>
                <p className="text-[#bfc1c6] font-light leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#e5e7eb] mb-4">
            Έτοιμοι να δημιουργήσουμε κάτι μοναδικό μαζί;
          </h2>
          <p className="text-[#bfc1c6] font-light mb-8 max-w-2xl mx-auto">
            Επικοινωνήστε μαζί μας για να συζητήσουμε τις ιδέες σας και να δημιουργήσουμε το τέλειο κόσμημα για εσάς.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#23232a] text-[#e5e7eb] hover:bg-[#18181b] px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 border border-[#bfc1c6]"
            >
              ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#bfc1c6] text-[#bfc1c6] hover:bg-[#23232a] px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 bg-transparent"
            >
              ΔΕΙΤΕ ΤΗ ΣΥΛΛΟΓΗ
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
