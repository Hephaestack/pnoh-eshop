"use client"
import { useTranslation } from "react-i18next";

export default function PaymentPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">{t('payments_methods_title', 'Τρόποι Πληρωμής')}</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">
            {t('payments_methods_intro', 'Επιλέξτε τον τρόπο πληρωμής που προτιμάτε για την παραγγελία σας')}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Credit/Debit Cards */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('payments_card_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  {t('payments_card_desc')}
                </p>
              </div>


              {/* Security */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('payments_security_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">{t('payments_title', 'Payments')}</h1>
              
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  {t('payments_security_desc')}
                </p>
              </div>

              {/* PayPal */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('payments_paypal_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <p className="text-[#bfc1c6] font-light leading-relaxed">
                  {t('payments_paypal_desc')}
                </p>
              </div>

              {/* Bank Transfer */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('payments_bank_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('payments_bank_desc')}</p>
                  <div className="p-6 border rounded-lg bg-blue-900/20 border-blue-700/30">
                    <p>
                      <strong>{t('payments_bank_holder')}</strong> ΣΕΡΒΟΣ ΜΙΧΑΗΛ
                    </p>
                    <p>
                      <strong>{t('payments_bank_bank')}</strong> ALPHA BANK
                    </p>
                    <p>
                      <strong>{t('payments_bank_iban')}</strong> GR 160 140 4050 4050 0200 2018 725
                    </p>
                  </div>
                  <div className="p-6 border rounded-lg bg-red-900/20 border-red-700/30">
                    <p className="font-medium text-red-300">
                      {t('payments_bank_notice')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
