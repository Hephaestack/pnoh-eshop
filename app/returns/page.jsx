'use client';
import { useTranslation } from "react-i18next";

export default function ReturnsPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title">{t('returns_policy')}</h1>
          <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
          <p className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed">
            {t('returns_intro')}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert">
              <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                <p>{t('returns_p1')}</p>
                <p>{t('returns_p2')}</p>
                <p>{t('returns_p3')}</p>
                <p>{t('returns_p4')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
