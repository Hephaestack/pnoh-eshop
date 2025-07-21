
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">Επικοινωνία</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">
            Είμαστε εδώ για να σας βοηθήσουμε. Επικοινωνήστε μαζί μας για οποιαδήποτε ερώτηση σχετικά με τα κοσμήματά μας.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            {/* Contact Form */}
            <div className="space-y-8 flex flex-col items-center lg:items-start w-full lg:w-[520px] xl:w-[600px] mx-auto">
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#e5e7eb] mb-4">Στείλτε μας Μήνυμα</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6"></div>
                <p className="text-[#bfc1c6] font-light">
                  Συμπληρώστε τη φόρμα παρακάτω και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
                </p>
              </div>

              <form className="w-full max-w-xl space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#e5e7eb] mb-2">
                      Όνομα *
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      className="border-[#23232a] bg-[#23232a] text-[#e5e7eb] focus:border-[#bfc1c6] placeholder-[#bfc1c6] transition-colors"
                      placeholder="Το όνομά σας"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#e5e7eb] mb-2">
                      Επώνυμο *
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      className="border-[#23232a] bg-[#23232a] text-[#e5e7eb] focus:border-[#bfc1c6] placeholder-[#bfc1c6] transition-colors"
                      placeholder="Το επώνυμό σας"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#e5e7eb] mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="border-[#23232a] bg-[#23232a] text-[#e5e7eb] focus:border-[#bfc1c6] placeholder-[#bfc1c6] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#e5e7eb] mb-2">
                    Τηλέφωνο
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    className="border-[#23232a] bg-[#23232a] text-[#e5e7eb] focus:border-[#bfc1c6] placeholder-[#bfc1c6] transition-colors"
                    placeholder="+30 210 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#e5e7eb] mb-2">
                    Θέμα *
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    className="border-[#23232a] bg-[#23232a] text-[#e5e7eb] focus:border-[#bfc1c6] placeholder-[#bfc1c6] transition-colors"
                    placeholder="Θέμα μηνύματος"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#e5e7eb] mb-2">
                    Μήνυμα *
                  </label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    className="border-[#23232a] bg-[#23232a] text-[#e5e7eb] focus:border-[#bfc1c6] placeholder-[#bfc1c6] transition-colors resize-none"
                    placeholder="Γράψτε το μήνυμά σας εδώ..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#23232a] text-[#e5e7eb] hover:bg-[#18181b] border border-[#bfc1c6] px-8 py-3 text-sm font-light tracking-wide transition-all duration-300"
                >
                  ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col items-center w-full lg:items-start">
              <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#e5e7eb] mb-4">Στοιχεία Επικοινωνίας</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6"></div>
                <p className="text-[#bfc1c6] font-light mb-2">
                  Επισκεφθείτε το κατάστημά μας ή επικοινωνήστε μαζί μας με έναν από τους παρακάτω τρόπους.
                </p>
              </div>

              <div className="grid justify-center w-full grid-cols-1 gap-6 sm:grid-cols-2">
                <Card className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 bg-[#23232a]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#bfc1c6]" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-medium text-[#e5e7eb] mb-2">Διεύθυνση</h3>
                        <p className="text-[#bfc1c6] font-light">
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

                <Card className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 bg-[#23232a]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                      <div className="flex-shrink-0">
                        <Phone className="w-6 h-6 text-[#bfc1c6]" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-medium text-[#e5e7eb] mb-2">Τηλέφωνο</h3>
                        <p className="text-[#bfc1c6] font-light">
                          +30 210 123 4567
                          <br />
                          +30 694 123 4567
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 bg-[#23232a]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                      <div className="flex-shrink-0">
                        <Mail className="w-6 h-6 text-[#bfc1c6]" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-medium text-[#e5e7eb] mb-2">Email</h3>
                        <p className="text-[#bfc1c6] font-light">
                          info@pnoe.gr
                          <br />
                          orders@pnoe.gr
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 bg-[#23232a]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#bfc1c6]" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-medium text-[#e5e7eb] mb-2">Ώρες Λειτουργίας</h3>
                        <div className="text-[#bfc1c6] font-light space-y-1">
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
      <section className="py-16 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#e5e7eb] mb-4">Βρείτε μας</h2>
            <div className="w-12 h-px bg-[#bfc1c6] mx-auto"></div>
          </div>

          <div className="bg-[#18181b] h-96 rounded-lg flex items-center justify-center overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.0097705471794!2d23.731984276812668!3d38.00023257192948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1a2c8db985e5d%3A0x21c13a322421b4c0!2sIo%C3%A1nnou%20Drosopo%C3%BAlou%2063%2C%20Athina%20112%2057!5e0!3m2!1sen!2sgr!4v1753106905151!5m2!1sen!2sgr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
