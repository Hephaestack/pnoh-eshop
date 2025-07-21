import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center space-y-8 px-4">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extralight tracking-widest text-black">Πνοή</h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
            <p className="text-lg md:text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ανακαλύψτε τη συλλογή μας από εκλεπτυσμένα κοσμήματα που συνδυάζουν τη σύγχρονη αισθητική με την
              παραδοσιακή τεχνοτροπία
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-light tracking-wide transition-all duration-300"
            >
              ΕΞΕΡΕΥΝΗΣΤΕ ΤΗ ΣΥΛΛΟΓΗ
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-black hover:bg-gray-50 px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 bg-transparent"
            >
              ΝΕΑ ΑΦΙΞΗ
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-1 h-20 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-50"></div>
        <div className="absolute bottom-1/4 right-10 w-1 h-20 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-50"></div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black mb-4">Επιλεγμένες Συλλογές</h2>
            <div className="w-16 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Δαχτυλίδια", subtitle: "Κλασικά & Σύγχρονα", image: "/placeholder.svg?height=400&width=300" },
              { title: "Κολιέ", subtitle: "Εκλεπτυσμένα Σχέδια", image: "/placeholder.svg?height=400&width=300" },
              {
                title: "Σκουλαρίκια",
                subtitle: "Διαχρονική Κομψότητα",
                image: "/placeholder.svg?height=400&width=300",
              },
            ].map((collection, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-none hover:shadow-lg transition-all duration-500"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.title}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-light text-black mb-2 tracking-wide">{collection.title}</h3>
                    <p className="text-gray-600 text-sm font-light">{collection.subtitle}</p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs tracking-widest text-gray-500 border-b border-gray-300 pb-1">
                        ΔΕΙΤΕ ΠΕΡΙΣΣΟΤΕΡΑ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black">Η Τέχνη της Κοσμηματοποιίας</h2>
              <div className="w-16 h-px bg-gray-400"></div>
              <p className="text-gray-600 leading-relaxed font-light">
                Στην Πνοή, κάθε κόσμημα είναι μια μοναδική έκφραση τέχνης και κομψότητας. Συνδυάζουμε παραδοσιακές
                τεχνικές με σύγχρονο design για να δημιουργήσουμε κομμάτια που ξεχωρίζουν.
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                Κάθε δημιουργία μας φτιάχνεται με προσοχή στη λεπτομέρεια, χρησιμοποιώντας μόνο τα καλύτερα υλικά για να
                εξασφαλίσουμε την ποιότητα και τη διαρκεια.
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
                alt="Jewelry crafting"
                width={400}
                height={500}
                className="w-full h-96 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-gray-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Δωρεάν Αποστολή", subtitle: "Για παραγγελίες άνω των 50€" },
              { icon: Shield, title: "Εγγύηση Ποιότητας", subtitle: "2 χρόνια εγγύηση σε όλα τα προϊόντα" },
              { icon: RotateCcw, title: "Εύκολες Επιστροφές", subtitle: "30 ημέρες για επιστροφή" },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <feature.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-light text-black tracking-wide">{feature.title}</h3>
                <p className="text-gray-600 text-sm font-light">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
