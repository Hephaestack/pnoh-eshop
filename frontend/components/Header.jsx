"use client"

import Link from "next/link"
import { UserButton, useUser } from '@clerk/nextjs';

function MegaMenuItem({ href, img, label, onClick }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center min-w-[10rem] w-56 group text-white no-underline"
      style={{ textDecoration: 'none' }}
      onClick={onClick}
    >
      <div className="w-56 h-56 bg-gradient-to-br from-[#232326] to-[#18181b] rounded-2xl overflow-hidden flex items-center justify-center mb-4 border border-[#232326] shadow-[0_2px_12px_0_rgba(30,30,30,0.18)] group-hover:scale-105 group-hover:shadow-[0_4px_24px_0_rgba(80,80,80,0.22)] transition-all duration-200">
        <img
          src={img}
          alt={label}
          className="object-contain w-48 h-48 drop-shadow-[0_2px_8px_#00000033] group-hover:scale-110 transition-transform duration-200"
        />
      </div>
      <span className="block text-base font-medium px-4 py-2 rounded-xl bg-[#18181b] border border-[#232326] shadow-[0_1px_6px_#23232633] text-white text-center group-hover:bg-[#232326] group-hover:text-[#f8f8f8] transition-all duration-200">
        {label}
      </span>
    </Link>
  );
}


import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, ShoppingBag, Menu, X } from "lucide-react"

import { AnimatePresence, motion } from "framer-motion"
import LanguageSwitcher from "./language-switcher"
import useCartStore from "@/lib/store/cart"

export function Header() {
  const { t } = useTranslation();
  const { isSignedIn, user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [jewelryOpen, setJewelryOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const jewelryRef = useRef(null)
  const headerRef = useRef(null);

  // Get cart state
  const { getTotals } = useCartStore();
  const totals = mounted ? getTotals() : { itemCount: 0 };

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!jewelryOpen) return;
    function handleClick(e) {
      if (jewelryRef.current && !jewelryRef.current.contains(e.target)) {
        setJewelryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [jewelryOpen]);

  // Hide mobile menu if resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll and layout shift when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalOverflowX = document.body.style.overflowX;
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
      };
    }
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
  }, [mobileMenuOpen]);

  return (
    <header ref={headerRef} className="border-b border-white sticky main-header bg-[#18181b] shadow-[0_2px_8px_0_rgba(180,180,180,0.04)]">
      <div className="px-2 py-2 mx-auto max-w-7xl sm:px-6 h-20 md:h-24 lg:h-28 flex items-center">
        <div className="grid items-center w-full grid-cols-3 gap-4 h-full">
          {/* Logo Left */}
          <div className="flex items-center min-w-0 justify-start">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.webp"
                alt={t('logo_alt')}
                className="h-16 w-auto object-contain drop-shadow-[0_1px_2px_#bcbcbc55] md:h-20 lg:h-22"
                style={{ maxWidth: '140px' }}
                priority="true"
              />
            </Link>
          </div>
          {/* Centered Menu (hidden placeholder on mobile to keep grid layout) */}
          <nav className="relative items-center justify-center hidden min-w-0 mx-auto space-x-8 md:flex shrink-0">
            <Link href="/about" className="text-md font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5" onClick={() => setJewelryOpen(false)}>
              {t('about_us')}
            </Link>
            <div className="relative" ref={jewelryRef}>
              {/* Overlay for blur when dropdown is open, but not on header */}
              {jewelryOpen && (
                <div
                  className="fixed bottom-0 left-0 right-0 z-30 transition-opacity duration-200 opacity-100 bg-black/30 backdrop-blur-sm"
                  style={{ top: 'var(--total-header-height)', pointerEvents: 'auto' }}
                  aria-hidden="true"
                  onClick={() => setJewelryOpen(false)}
                />
              )}
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={jewelryOpen}  
                onClick={() => setJewelryOpen((v) => !v)}
                className={`text-md font-light transition-colors pb-0.5 flex items-center gap-1 focus:outline-none text-white hover:text-white`}
              >
                {t('jewelry')}
                <svg className={`w-3 h-3 ml-1 transition-transform ${jewelryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-10 w-[1400px] max-w-[99vw] bg-[#18181b] border border-[#232326] rounded-2xl shadow-[0_8px_32px_0_#23232a99] ring-1 ring-[#23232a]/30 z-40 transition-all duration-200 ${jewelryOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'} origin-top flex justify-center items-center`}
                style={{ boxShadow: '0 8px 32px 0 #23232a99' }}
                role="menu"
                tabIndex={-1}
              >
                <div className="flex justify-center w-full gap-20 py-10 px-14">
                  <MegaMenuItem href="/collections" img="/images/all_jewelry.jpg" label={t('all_jewelry')} onClick={() => setJewelryOpen(false)} />
                  <MegaMenuItem href="/rings" img="/images/rings.jpg" label={t('rings')} onClick={() => setJewelryOpen(false)} />
                  <MegaMenuItem href="/bracelets" img="/images/bracelets.jpg" label={t('bracelets')} onClick={() => setJewelryOpen(false)} />
                  <MegaMenuItem href="/necklaces" img="/images/necklaces.jpg" label={t('necklaces')} onClick={() => setJewelryOpen(false)} />
                  <MegaMenuItem href="/earrings" img="/images/earrings.jpg" label={t('earrings')} onClick={() => setJewelryOpen(false)} />
                </div>
              </div>



            </div>
            <Link href="/contact" className="text-md font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5" onClick={() => setJewelryOpen(false)}>
              {t('contact')}
            </Link>
          </nav>
          {/* Placeholder for center column on mobile */}
          <div className="block md:hidden" />
          {/* Icons Right */}
          <div className="flex items-center justify-end min-w-0 space-x-4 shrink-0">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-[#232326] border border-white rounded-full"
            >
              <Search className="w-5 h-5 text-white hover:text-[#f8f8f8] transition-colors" />
            </Button>
            {isSignedIn ? (
              <div className="flex items-center">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-white rounded-full hover:border-[#f8f8f8] transition-colors",
                      userButtonPopoverCard: "bg-[#18181b] border border-[#232326]",
                      userButtonPopoverActionButton: "text-white hover:bg-[#232326]",
                      userButtonPopoverActionButtonText: "text-white",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/account"
                />
              </div>
            ) : (
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="icon" className="hover:bg-[#232326] border border-white rounded-full">
                  <User className="w-5 h-5 text-white transition-colors hover:text-white" />
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hover:bg-[#232326] border border-white rounded-full relative">
                <ShoppingBag className="w-5 h-5 text-white transition-colors hover:text-white" />
                {totals.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[1rem] h-4 flex items-center justify-center px-1 border border-white shadow-[0_0_4px_#bcbcbc99] font-semibold">
                    {totals.itemCount > 99 ? '99+' : totals.itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {/* Mobile Menu Button - always takes space */}
            <div className="md:invisible">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#232326] border border-white rounded-full"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? t('close_menu') : t('open_menu')}
              >
                <Menu className="text-white w-7 h-7" />
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Overlay - outside flex row to prevent icon shift */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-[#18181b] border-l border-white shadow-lg flex flex-col p-8 gap-6 overflow-x-hidden pt-20"
            >
              {/* Close X at top right */}
              <div className="flex justify-end mb-4">
              <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#232326] border border-white rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t('close_menu')}
                >
                  <X className="text-white w-7 h-7" />
                </Button>
              </div>
           
              {/* {t('jewelry_dropdown_mobile')} Dropdown for mobile */}
              <MobileDropdownNav />
              <Link href="/about" className="text-lg font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                {t('about_us')}
              </Link>
              <Link href="/contact" className="text-lg font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                {t('contact')}
              </Link>
              <Link href="/cart" className="text-lg font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Καλάθι {totals.itemCount > 0 && `(${totals.itemCount})`}
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>



        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pt-4 mt-4 mb-4 border-t border-white">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder={t('search_products')}
                className="flex-1 border-white focus:border-white bg-[#232326] text-[#e5e5e5] placeholder:text-[#bcbcbc] transition-colors shadow-[0_1px_4px_#bcbcbc33]"
              />
              <Button variant="outline" className="border-white hover:border-[#f8f8f8] transition-colors bg-[#232326] text-[#e5e5e5] shadow-[0_1px_4px_#bcbcbc33]">
                {t('search')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MobileDropdownNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between text-lg font-light text-white hover:text-white transition-colors pb-0.5 focus:outline-none`}
      >
        <span>{t('jewelry')}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`pl-2 mt-1 flex flex-col gap-1 transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
        <Link href="/collections" className="block py-2 pl-4 text-base text-white hover:text-white hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          {t('all_jewelry')}
        </Link>
        <Link href="/rings" className="block py-2 pl-4 text-base text-white hover:text-white hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          {t('rings')}
        </Link>
        <Link href="/bracelets" className="block py-2 pl-4 text-base text-white hover:text-white hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          {t('bracelets')}
        </Link>
        <Link href="/necklaces" className="block py-2 pl-4 text-base text-white hover:text-white hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          {t('necklaces')}
        </Link>
        <Link href="/earrings" className="block py-2 pl-4 text-base text-white hover:text-white hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          {t('earrings')}
        </Link>
      </div>
    </div>
  );
}
