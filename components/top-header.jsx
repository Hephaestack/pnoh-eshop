
import { Phone, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
export default function TopHeader() {
  const { t } = useTranslation();
  return (
    <div className="border-b border-gray-200 bg-[#18181b] sticky top-header">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Phone Number */}
          <div className="flex items-center space-x-2 text-sm text-white">
            <Phone className="w-4 h-4" />
            <span className="font-medium"> +30 210 8813356</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            <Link
              href="https://www.facebook.com/pnoikosmima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-200 "
              aria-label={t('follow_facebook')}
            >
              <Facebook className="w-4 h-4 fill-current" />
            </Link>
            <Link
              href="https://www.instagram.com/pnoi_kosmima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-200 "
              aria-label={t('follow_instagram')}
            >
              <Instagram className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
// ...existing code...
