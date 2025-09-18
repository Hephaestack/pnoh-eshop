"use client"

import i18n from '../i18n/i18n';
import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const languages = [
    { code: "en", name: t('lang_en') },
    { code: "gr", name: t('lang_gr') },
  ];
  const [showPopup, setShowPopup] = useState(false);
  const [spin, setSpin] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);


  const swapLanguage = () => {
    const nextLang = currentLang === 'en' ? 'gr' : 'en';
    setCurrentLang(nextLang);
    i18n.changeLanguage(nextLang);
    setSpin(true);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setSpin(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={swapLanguage}
        className="flex items-center justify-center p-2 text-white transition-all duration-200 border border-white rounded-full bg-gray hover:border-white focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
        title={t('Change language')}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={spin ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{ display: 'inline-block' }}
        >
          <Globe className="w-5 h-5" />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-4 py-2 rounded-lg bg-[#232326] text-white shadow-lg border border-[#232326] z-50 text-sm font-medium"
            style={{ minWidth: 60, textAlign: 'center' }}
          >
            {languages.find(l => l.code === currentLang)?.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
