

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="pt-14 pb-8 bg-[#18181b] border-t-2 border-[#bfc1c6] w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-8">
        <div
          className="grid items-center w-full grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8 lg:gap-12 md:items-start md:text-left"
        >
          {/* Company Info */}
          <div className="flex flex-col items-center w-full space-y-6 text-center md:items-start md:text-left">
            <Image
              src="/logo.webp"
              alt={t('logo_alt')}
              width={150}
              height={150}
            />
            <p className="mb-4 text-sm font-light leading-relaxed text-[#bfc1c6]">
              {t('footer_company_desc')}
            </p>
            <p className="text-sm font-light text-[#bfc1c6]">pnoi@yahoo.gr</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center w-full space-y-6 text-center md:items-center">
            <h4 className="text-lg font-medium tracking-wide text-[#e5e7eb]">{t('footer_navigation')}</h4>
            <div className="space-y-3">
              <Link
                href="/collections"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('jewelry')}
              </Link>
              <Link
                href="/about"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('about_us')}
              </Link>
              <Link
                href="/contact"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('contact')}
              </Link>
            </div>
          </div>

          {/* Legal & Policies */}
          <div className="flex flex-col items-center w-full space-y-6 text-center md:items-end md:text-right">
            <h4 className="text-lg font-medium tracking-wide text-[#e5e7eb]">{t('footer_info')}</h4>
            <div className="space-y-3">
              <Link
                href="/privacy-policy"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('privacy_policy')}
              </Link>
              <Link
                href="/terms-conditions"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('terms_conditions')}
              </Link>
              <Link
                href="/returns"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('returns_policy')}
              </Link>
              <Link
                href="/shipping"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('shipping_methods')}
              </Link>
              <Link
                href="/payments"
                className="block text-sm font-light text-[#bfc1c6] transition-colors hover:text-white"
              >
                {t('payment_methods')}
              </Link>
              <div className="pt-4 space-y-2">
                <p className="text-sm font-light text-[#bfc1c6]">
                  <strong>{t('phone')}:</strong>
                  <br />+30 210 123 4567
                </p>
                <p className="text-sm font-light text-[#bfc1c6]">
                  <strong>{t('address')}:</strong>
                  <br />{t('footer_address_line1')},
                  <br />{t('footer_address_line2')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-14 border-t border-[#bfc1c6] w-full">
          <div className="flex flex-col items-center justify-between w-full gap-6 md:flex-row">
            <div className="text-sm font-light text-[#bfc1c6] text-center md:text-left">
              © 2025 {t('brand_name')}. {t('footer_rights')}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <div className="flex flex-wrap items-center justify-center h-12 gap-4">
                <img src="/payment-icons/mastercard.svg" alt="Mastercard" className="h-8" />
                <img src="/payment-icons/maestro.svg" alt="Maestro" className="h-8" />
                <img src="/payment-icons/dinersclub.svg" alt="Diners Club" className="h-8" />
                <img src="/payment-icons/discover.svg" alt="Discover" className="h-8" />
                <img src="/payment-icons/paypal.svg" alt="PayPal" className="h-8" />
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-[#bfc1c6] text-center md:text-right font-light opacity-80">
            Powered by Hephaestack
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
export { Footer };
