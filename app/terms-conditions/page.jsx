"use client";
import { useTranslation } from "react-i18next";

export default function TermsConditionsPage() {
  const { t } = useTranslation('terms');
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">{t('terms_conditions')}</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">
            {t('terms_intro')}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Section 1 - Γενικά */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">1. {t('terms_section1_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('terms_section1_p1')}</p>
                  <p>{t('terms_section1_p2')}</p>
                  <p>{t('terms_section1_p3')}</p>
                </div>
              </div>

              {/* Section 2 - Ρητή αποδοχή */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">2. {t('terms_section2_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('terms_section2_p1')}</p>
                  <p>{t('terms_section2_p2')}</p>
                  <p>{t('terms_section2_p3')}</p>
                </div>

              </div>
              {/* Section 3 - Πνευματική Ιδιοκτησία */}

              {/* Section 3 - Πνευματική Ιδιοκτησία */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">
                  3. Δικαιώματα πνευματικής ιδιοκτησίας
                </h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    Οι εικόνες, λογότυπα, γραφικά, φωτογραφίες, κείμενα κλπ είναι πνευματική ιδιοκτησία μας και
                    προστατεύονται κατά τις σχετικές διατάξεις του ελληνικού δικαίου και των διεθνών συμβάσεων. Κάποια
                    από τα προϊόντα ή τις υπηρεσίες που αναφέρονται στις ηλεκτρονικές σελίδες της pnoikosmia.com και
                    φέρουν τα σήματα των αντίστοιχων, συνεργατών εταιρειών ή φορέων, αποτελούν δική τους πνευματική και
                    βιομηχανική ιδιοκτησία και συνεπώς οι φορείς αυτοί φέρουν τη σχετική ευθύνη.
                  </p>
                  <p>
                    Απαγορεύεται οποιαδήποτε αντιγραφή, αναλογική/ψηφιακή εγγραφή και μηχανική αναπαραγωγή, download,
                    μεταποίηση, μεταπώληση, δημιουργία παραγωγής εργασίας ή παραπλάνηση του κοινού σχετικά με τον
                    πραγματικό δικαιούχο και πάροχο του περιεχομένου του δικτυακού τόπου.
                  </p>
                </div>
              </div>

              {/* Section 4 - Ασφάλεια */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">4. Ασφάλεια</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    Σεβόμενοι το απόρρητο των προσωπικών σας δεδομένων, έχουμε λάβει μέτρα για την διασφάλιση και
                    προστασία τους.
                  </p>
                  <p>
                    Η ιστοσελίδα μας διέπεται από μέτρα ασφαλείας, τόσο για τη μεταφορά των δεδομένων, όσο και για την
                    προστασία από απώλεια, κακή χρήση ή αλλοίωση αυτών.
                  </p>
                  <p>
                    Τα στοιχεία των προσωπικών δεδομένων σας δεν αποκαλύπτονται σε τρίτους, εκτός εάν έχουμε ειδική
                    εξουσιοδότηση από εσάς, ή επιβάλλεται από διατάξεις του νόμου, δικαστική απόφαση ή απόφαση άλλης
                    δημόσιας αρχής.
                  </p>
                </div>
              </div>

              {/* Section 5 - Προστασία Δεδομένων */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">5. Προστασία Προσωπικών Δεδομένων</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    Κατά τη συμπλήρωση της φόρμας παραγγελίας αλλά και την υποβολή της σε εμάς, σας ζητούνται στοιχεία
                    προσωπικών δεδομένων (π.χ. ονοματεπώνυμο, πλήρης διεύθυνση, στοιχεία επικοινωνίας, κλπ). Μας
                    παρέχετε τα στοιχεία αυτά οικειοθελώς στο πλαίσιο εγγραφής σας, στην οποία προβαίνετε έχοντας ήδη
                    λάβει γνώση του και αποδεχθεί ανεπιφύλακτα το περιεχόμενο της παρούσας ιστοσελίδας και τους όρους
                    χρήσης αυτής και με τη ρητή συγκατάθεσή σας ότι τα στοιχεία αυτά επιτρέπεται να αποτελέσουν στο
                    μέλλον, οποτεδήποτε παρίσταται ανάγκη κατά την κρίση μας και μέχρις ότου μας γνωστοποιήσετε ότι
                    ανακαλείτε ρητά την παραπάνω συγκατάθεσή σας, αντικείμενο επεξεργασίας δεδομένων προσωπικού
                    χαρακτήρα σύμφωνα με τους ισχύοντες Νόμους.
                  </p>
                </div>
              </div>

              {/* Section 6 - Δηλώσεις και αποποιήσεις */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">6. Δηλώσεις και αποποιήσεις</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    <strong>6.1.</strong> Οι χρήστες συμφωνούν ότι η χρήση του δικτυακού τόπου γίνεται αποκλειστικά με
                    δική τους ευθύνη. Η pnoikosmima.com προσφέρει τα προϊόντα και το περιεχόμενο αυτού «ΩΣ ΕΧΕΙ» για
                    προσωπική χρήση και δεν προβαίνει σε οποιαδήποτε ρητή, σιωπηρή ή άλλη δήλωση ή εγγύηση σχετικά με
                    την ιστοσελίδα και τη χρήση αυτής. ΕΝΔΕΙΚΤΙΚΑ ΚΑΙ ΟΧΙ ΠΕΡΙΟΡΙΣΤΙΚΑ η pnoikosmima.com ΔΕΝ ΠΡΟΒΑΙΝΕΙ
                    ΣΕ ΔΗΛΩΣΕΙΣ ΚΑΙ ΕΓΓΥΗΣΕΙΣ ΜΗ ΠΑΡΑΒΙΑΣΗΣ Ή ΑΠΟΥΣΙΑΣ ΚΕΚΡΥΜΜΕΝΩΝ Η ΑΛΛΩΝ ΕΛΑΤΤΩΜΑΤΩΝ, ΑΚΡΙΒΕΙΑΣ Η
                    ΑΠΟΥΣΙΑΣ ΛΑΘΩΝ ΑΝΑΓΝΩΡΙΣΙΜΩΝ Ή ΜΗ.
                  </p>
                  <p>
                    <strong>6.2.</strong> Η pnoikosmima.com ΔΕΝ ΦΕΡΕΙ ΟΥΔΕΜΙΑ ΕΥΘΥΝΗ ΓΙΑ: (Α) ΛΑΘΗ, ΑΝΑΚΡΙΒΕΙΕΣ, (Β)
                    ΟΠΟΙΑΔΗΠΟΤΕ ΖΗΜΙΑ (ΠΕΡΙΟΥΣΙΑΚΗ Η ΗΘΙΚΗ) ΗΘΕΛΕ ΠΡΟΚΥΨΕΙ ΑΠΟ ΤΗ ΧΡΗΣΗ ΤΗΣ ΙΣΤΟΣΕΛΙΔΑΣ, (Γ) ΟΠΟΙΑΔΗΠΟΤΕ
                    ΔΙΑΚΟΠΗ, ΠΑΥΣΗ, ΚΑΚΗ ΠΟΙΟΤΗΤΑ ΛΗΨΗΣ ΤΩΝ ΥΠΗΡΕΣΙΩΝ ΤΗΣ ΙΣΤΟΣΕΛΙΔΑΣ, (Δ) ΙΟΥΣ, TROJANS HORSES ΠΟΥ
                    ΜΠΟΡΕΙ ΝΑ ΜΕΤΑΔΟΘΟΥΝ ΑΠΟ ΤΗΝ ΙΣΤΟΣΕΛΙΔΑ Ή ΟΠΟΙΟΝΔΗΠΟΤΕ ΤΡΙΤΟ ΧΡΗΣΙΜΟΠΟΙΕΙ ΤΗΝ ΙΣΤΟΣΕΛΙΔΑ, ΚΑΙ (Ε)
                    ΟΠΟΙΟΔΗΠΟΤΕ ΛΑΘΟΣ ΑΠΟ ΠΡΑΞΗ Ή ΠΑΡΑΛΕΙΨΗ ΕΠΙ ΤΟΥ ΠΕΡΙΕΧΟΜΕΝΟΥ ΤΗΣ ΙΣΤΟΣΕΛΙΔΑΣ, Ή ΓΙΑ ΟΠΟΙΑΔΗΠΟΤΕ
                    ΖΗΜΙΑ ΠΟΥ ΗΘΕΛΕ ΠΡΟΚΛΗΘΕΙ ΑΠΟ ΤΗ ΧΡΗΣΗ ΤΟΥ ΠΕΡΙΕΧΟΜΕΝΟΥ ΤΗΣ ΙΣΤΟΣΕΛΙΔΑΣ.
                  </p>
                </div>
              </div>

              {/* Section 7 - Εφαρμοστέο Δίκαιο */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">7. Εφαρμοστέο Δίκαιο</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    <strong>7.1.</strong> Οι Όροι Χρήσης, καθώς και οποιαδήποτε τροποποίησή τους διέπεται από το
                    ελληνικό δίκαιο, το δίκαιο της Ευρωπαϊκής Ένωσης και από τις σχετικές διεθνείς συνθήκες. Οποιαδήποτε
                    διάταξη των ανωτέρω όρων καταστεί αντίθετη προς το Νόμο, παύει αυτοδικαίως να ισχύει, χωρίς σε καμία
                    περίπτωση να θίγεται η ισχύς των λοιπών όρων.
                  </p>
                  <p>
                    <strong>7.2.</strong> Κάθε διαφορά που αφορά ή προκύπτει από την εφαρμογή των παρόντων όρων και την
                    εν γένει χρήση του δικτυακού τόπου, εφόσον δεν επιλυθεί φιλικά, υπάγεται στη δικαιοδοσία των
                    δικαστηρίων των Αθηνών.
                  </p>
                </div>
              </div>

              {/* Section 8 - Λοιποί Όροι */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">8. Λοιποί Όροι</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    <strong>8.1.</strong> Οι παρόντες Όροι Χρήσης και οποιαδήποτε δικαιώματα που περιέχονται σε αυτούς
                    αποτελούν τη συνολική συμφωνία μεταξύ της pnoikosmima.com και των χρηστών της ιστοσελίδας και
                    δεσμεύει μόνο αυτούς.
                  </p>
                  <p>
                    <strong>8.2.</strong> Η Εταιρεία διατηρεί το δικαίωμα να τροποποιεί ή/και να διακόπτει προσωρινά
                    ή/και μόνιμα μέρος ή το σύνολο των υπηρεσιών της ιστοσελίδας με ή χωρίς προειδοποίηση προς τους
                    Χρήστες.
                  </p>
                  <p>
                    <strong>8.3.</strong> Η Εταιρεία δικαιούται να τροποποιεί οποτεδήποτε μονομερώς και χωρίς
                    προειδοποίηση τους παρόντες Όρους Χρήσης. Ωστόσο η συνεχής χρήση της ιστοσελίδας και μετά από τις
                    τροποποιήσεις συνεπάγεται ανεπιφύλακτη αποδοχή των Όρων Χρήσης. Κατά συνέπεια συνιστάται η συχνή
                    επαλήθευση αυτών.
                  </p>
                  <p>
                    <strong>8.4.</strong> Εάν κάποιος Χρήστης διαφωνεί με τους Όρους Χρήσης που προβλέπονται στο παρόν
                    οφείλει να μη χρησιμοποιεί τις υπηρεσίες της ιστοσελίδας.
                  </p>
                </div>
              </div>

              {/* Section 3 - Πνευματική Ιδιοκτησία */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">3. {t('terms_section3_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('terms_section3_p1')}</p>
                  <p>{t('terms_section3_p2')}</p>
                </div>
              </div>

              {/* Section 4 - Ασφάλεια */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">4. {t('terms_section4_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('terms_section4_p1')}</p>
                  <p>{t('terms_section4_p2')}</p>
                  <p>{t('terms_section4_p3')}</p>
                </div>
              </div>

              {/* Section 5 - Προστασία Δεδομένων */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">5. {t('terms_section5_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('terms_section5_p1')}</p>
                </div>
              </div>

              {/* Section 6 - Επικοινωνία */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">6. {t('terms_section6_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p><strong>Email:</strong> pnoi@yahoo.gr</p>
                  <p><strong>{t('address')}:</strong> {t('footer_address_line1')}, {t('footer_address_line2')}</p>
                  <p><strong>ΑΦΜ:</strong> 129517325</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


