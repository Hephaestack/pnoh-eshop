'use client';
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ReturnsPage() {
  const { t } = useTranslation();

  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {t('returns_policy')}
          </motion.h1>
          <motion.div 
            className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          ></motion.div>
          <motion.p 
            className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            {t('returns_intro')}
          </motion.p>
        </div>
      </motion.section>

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
