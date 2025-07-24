"use client"


import i18n from '../i18n/i18n';
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const languages = [
    { code: "en", name: t('lang_en'), },
    { code: "gr", name: t('lang_gr'),  },
  ];
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages.find(l => l.code === i18n.language) || languages[0])
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    i18n.changeLanguage(language.code)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button: Only Globe icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 text-white transition-all duration-200 border border-white rounded-full bg-gray hover:border-white focus:outline-none focus:ring-2 focus:border-transparent"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t('Change language')}
      >
        <Globe className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-32 mt-2 duration-100 bg-[#18181b] border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 text-white">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full flex items-center space-x-2 px-3 py-1 text-sm text-left hover:bg-[#1d1d1d] transition-colors duration-150 ${
                  selectedLanguage.code === language.code ? " text-white font-medium" : "text-white"
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {selectedLanguage.code === language.code && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
