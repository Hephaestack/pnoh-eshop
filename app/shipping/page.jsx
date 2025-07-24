"use client";
import { useTranslation } from "react-i18next";

export default function ShippingPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">{t('shipping_title')}</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">{t('shipping_intro')}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Box Now */}
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">Box Now</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  Οι παραδόσεις των παραγγελιών αποστέλλονται μέσω της εταιρείας ταχυμεταφορών (courier) Box Now εντός
                  1-2 εργάσιμων ημερών. Τα έξοδα αποστολής είναι 2€
                </p>
              </div>

              {/* Γενική Ταχυδρομική */}
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">Γενική Ταχυδρομική</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  Οι παραδόσεις των παραγγελιών αποστέλλονται μέσω της εταιρείας ταχυμεταφορών (courier) Γενική
                  ταχυδρομική εντός 1-2 εργάσιμων ημερών. Τα έξοδα αποστολής είναι 10€.
                </p>
              </div>

              {/* Free Shipping */}
              <div className="p-6 border rounded-lg bg-green-900/20 border-green-700/30">
                <p className="font-light text-center text-green-300">
                  <strong>
                    Για όλους τους τρόπους αποστολής ισχύει ότι για παραγγελίες άνω των 150€ τα έξοδα αποστολής είναι
                    δωρεάν.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
