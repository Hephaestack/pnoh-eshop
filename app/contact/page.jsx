import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black mb-4">Επικοινωνία</h1>
          <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Είμαστε εδώ για να σας βοηθήσουμε. Επικοινωνήστε μαζί μας για οποιαδήποτε ερώτηση σχετικά με τα κοσμήματά
            μας.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-wide text-black mb-4">Στείλτε μας Μήνυμα</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light">
                  Συμπληρώστε τη φόρμα παρακάτω και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                      Όνομα *
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      className="border-gray-200 focus:border-black transition-colors"
                      placeholder="Το όνομά σας"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
                      Επώνυμο *
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      className="border-gray-200 focus:border-black transition-colors"
                      placeholder="Το επώνυμό σας"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="border-gray-200 focus:border-black transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                    Τηλέφωνο
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    className="border-gray-200 focus:border-black transition-colors"
                    placeholder="+30 210 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                    Θέμα *
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    className="border-gray-200 focus:border-black transition-colors"
                    placeholder="Θέμα μηνύματος"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                    Μήνυμα *
                  </label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    className="border-gray-200 focus:border-black transition-colors resize-none"
                    placeholder="Γράψτε το μήνυμά σας εδώ..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-light tracking-wide transition-all duration-300"
                >
                  ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-wide text-black mb-4">Στοιχεία Επικοινωνίας</h2>
                <div className="w-12 h-px bg-gray-400 mb-6"></div>
                <p className="text-gray-600 font-light">
                  Επισκεφθείτε το κατάστημά μας ή επικοινωνήστε μαζί μας με έναν από τους παρακάτω τρόπους.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black mb-2">Διεύθυνση</h3>
                        <p className="text-gray-600 font-light">
                          Οδός Παραδείγματος 123
                          <br />
                          10678 Αθήνα
                          <br />
                          Ελλάδα
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Phone className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black mb-2">Τηλέφωνο</h3>
                        <p className="text-gray-600 font-light">
                          +30 210 123 4567
                          <br />
                          +30 694 123 4567
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Mail className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black mb-2">Email</h3>
                        <p className="text-gray-600 font-light">
                          info@pnoe.gr
                          <br />
                          orders@pnoe.gr
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black mb-2">Ώρες Λειτουργίας</h3>
                        <div className="text-gray-600 font-light space-y-1">
                          <p>Δευτέρα - Παρασκευή: 10:00 - 20:00</p>
                          <p>Σάββατο: 10:00 - 18:00</p>
                          <p>Κυριακή: Κλειστά</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-black mb-4">Βρείτε μας</h2>
            <div className="w-12 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 font-light">Χάρτης Google Maps θα εμφανιστεί εδώ</p>
          </div>
        </div>
      </section>
    </div>
  )
}
