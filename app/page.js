import Hero from "@/components/Hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Hero Section */}
    <Hero />

      {/* Featured Collections */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">Επιλεγμένες Συλλογές</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto"></div>
          </div>

          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-3">
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
                className="group cursor-pointer border border-[#23232a] shadow-none hover:shadow-[0_0_16px_#bfc1c6] transition-all duration-500 bg-[#18181b]"
              >
                <CardContent className="flex flex-col items-center p-0">
                  <div className="relative flex justify-center w-full overflow-hidden">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.title}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[30%]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#23232a]/30 transition-all duration-300"></div>
                  </div>
                  <div className="flex flex-col items-center p-6 text-center">
                    <h3 className="text-xl font-light text-[#e5e7eb] mb-2 tracking-wide">{collection.title}</h3>
                    <p className="text-[#bfc1c6] text-sm font-light">{collection.subtitle}</p>
                    <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <span className="text-xs tracking-widest text-[#bfc1c6] border-b border-[#bfc1c6] pb-1">
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
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid items-center justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            <div className="flex flex-col items-center space-y-6 lg:items-start">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb]">Η Τέχνη της Κοσμηματοποιίας</h2>
              <div className="w-16 h-px bg-[#bfc1c6]"></div>
              <p className="text-[#bfc1c6] leading-relaxed font-light">
                Στην Πνοή, κάθε κόσμημα είναι μια μοναδική έκφραση τέχνης και κομψότητας. Συνδυάζουμε παραδοσιακές
                τεχνικές με σύγχρονο design για να δημιουργήσουμε κομμάτια που ξεχωρίζουν.
              </p>
              <p className="text-[#bfc1c6] leading-relaxed font-light">
                Κάθε δημιουργία μας φτιάχνεται με προσοχή στη λεπτομέρεια, χρησιμοποιώντας μόνο τα καλύτερα υλικά για να
                εξασφαλίσουμε την ποιότητα και τη διαρκεια.
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
                alt="Jewelry crafting"
                width={400}
                height={500}
                className="w-full h-96 object-cover grayscale-[30%]"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#bfc1c6] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#23232a] border-t-2 border-[#bfc1c6]">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Truck, title: "Δωρεάν Αποστολή", subtitle: "Για παραγγελίες άνω των 50€" },
              { icon: Shield, title: "Εγγύηση Ποιότητας", subtitle: "2 χρόνια εγγύηση σε όλα τα προϊόντα" },
              { icon: RotateCcw, title: "Εύκολες Επιστροφές", subtitle: "30 ημέρες για επιστροφή" },
            ].map((feature, index) => (
              <div key={index} className="space-y-4 text-center">
                <div className="flex justify-center">
                  <feature.icon className="w-8 h-8 text-[#bfc1c6]" />
                </div>
                <h3 className="text-lg font-light text-[#e5e7eb] tracking-wide">{feature.title}</h3>
                <p className="text-[#bfc1c6] text-sm font-light">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
