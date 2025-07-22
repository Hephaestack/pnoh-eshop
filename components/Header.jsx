"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Search, User, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { useState, useEffect, useRef } from "react"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [jewelryOpen, setJewelryOpen] = useState(false)
  const jewelryRef = useRef(null)

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
      document.body.style.overflow = 'hidden';      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
      };
  const [jewelryOpen, setJewelryOpen] = useState(false)
  const jewelryRef = useRef(null)
    }
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
  }, [mobileMenuOpen]);

  return (
    <header className="border-b border-[#bcbcbc] sticky top-0 bg-[#18181b] z-50 shadow-[0_2px_8px_0_rgba(180,180,180,0.04)]">
      <div className="px-2 py-1 mx-auto max-w-7xl sm:px-6 min-h-[56px]">
        <div className="grid items-center w-full grid-cols-3">
          {/* Logo Left */}
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.webp"
                alt="Πνοή logo"
                className="h-20 w-auto object-contain drop-shadow-[0_1px_2px_#bcbcbc55] md:h-24 lg:h-26"
                style={{ maxWidth: '150px' }}
                priority="true"
              />
            </Link>
          </div>
          {/* Centered Menu (hidden placeholder on mobile to keep grid layout) */}
          <nav className="relative items-center justify-center hidden min-w-0 mx-auto space-x-8 md:flex">
            <Link href="/about" className="text-sm font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5">
              ΠΟΙΟΙ ΕΙΜΑΣΤΕ
            </Link>
            <div className="relative" ref={jewelryRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={jewelryOpen}
                onClick={() => setJewelryOpen((v) => !v)}
                className={`text-sm font-light transition-colors border-b border-transparent pb-0.5 flex items-center gap-1 focus:outline-none ${jewelryOpen ? 'text-white border-[#bcbcbc]' : 'text-[#bcbcbc] hover:text-[#f8f8f8] hover:border-[#bcbcbc]'}`}
              >
                ΚΟΣΜΗΜΑΤΑ
                <svg className={`w-3 h-3 ml-1 transition-transform ${jewelryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[200px] bg-[#18181b] border border-[#bcbcbc] rounded-xl shadow-2xl ring-1 ring-[#23232a]/40 z-40 transition-all duration-200 ${jewelryOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'} origin-top`}
                style={{boxShadow:'0 8px 32px 0 #23232a55'}} 
                role="menu"
                tabIndex={-1}
              >
                <Link href="/collections" className="block px-6 py-3 text-sm text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] border-b border-[#23232a] transition-colors rounded-t-xl" role="menuitem" onClick={()=>setJewelryOpen(false)}>Όλα τα Κοσμήματα</Link>
                <Link href="/rings" className="block px-6 py-3 text-sm text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] border-b border-[#23232a] transition-colors" role="menuitem" onClick={()=>setJewelryOpen(false)}>Δαχτυλίδια</Link>
                <Link href="/bracelets" className="block px-6 py-3 text-sm text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] border-b border-[#23232a] transition-colors" role="menuitem" onClick={()=>setJewelryOpen(false)}>Βραχιόλια</Link>
                <Link href="/necklaces" className="block px-6 py-3 text-sm text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] border-b border-[#23232a] transition-colors" role="menuitem" onClick={()=>setJewelryOpen(false)}>Κολιέ</Link>
                <Link href="/earrings" className="block px-6 py-3 text-sm text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] transition-colors rounded-b-xl" role="menuitem" onClick={()=>setJewelryOpen(false)}>Σκουλαρίκια</Link>
              </div>
            </div>
            <Link href="/contact" className="text-sm font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5">
              EΠΙΚΟΙΝΩΝΙΑ
            </Link>
          </nav>
          {/* Placeholder for center column on mobile */}
          <div className="block md:hidden" />
          {/* Icons Right */}
          <div className="flex items-center justify-end min-w-0 space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-[#232326] border border-[#bcbcbc] rounded-full"
            >
              <Search className="w-5 h-5 text-[#bcbcbc] hover:text-[#f8f8f8] transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-[#232326] border border-[#bcbcbc] rounded-full">
              <User className="w-5 h-5 text-[#bcbcbc] hover:text-[#f8f8f8] transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-[#232326] border border-[#bcbcbc] rounded-full relative">
              <ShoppingBag className="w-5 h-5 text-[#bcbcbc] hover:text-[#f8f8f8] transition-colors" />
              <span className="absolute -top-2 -right-2 bg-[#232326] text-[#bcbcbc] text-xs rounded-full w-4 h-4 flex items-center justify-center border border-[#bcbcbc] shadow-[0_0_4px_#bcbcbc99]">
                0
              </span>
            </Button>
            {/* Mobile Menu Button - always takes space */}
            <div className="md:invisible">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#232326] border border-[#bcbcbc] rounded-full"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              >
                <Menu className="w-7 h-7 text-[#bcbcbc]" />
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
              className="fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-[#18181b] border-l border-[#bcbcbc] shadow-lg flex flex-col p-8 gap-6 overflow-x-hidden"
            >
              {/* Close X at top right */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#232326] border border-[#bcbcbc] rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Κλείσιμο μενού"
                >
                  <X className="w-7 h-7 text-[#bcbcbc]" />
                </Button>
              </div>
           
              {/* ΚΟΣΜΗΜΑΤΑ Dropdown for mobile */}
              <MobileDropdownNav />
              <Link href="/about" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΠΟΙΟΙ ΕΙΜΑΣΤΕ
              </Link>
              <Link href="/contact" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΕΠΙΚΟΙΝΩΝΙΑ
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>



        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 border-t border-[#bcbcbc] pt-4">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Αναζήτηση προϊόντων..."
                className="flex-1 border-[#bcbcbc] focus:border-[#f8f8f8] bg-[#232326] text-[#e5e5e5] placeholder:text-[#bcbcbc] transition-colors shadow-[0_1px_4px_#bcbcbc33]"
              />
              <Button variant="outline" className="border-[#bcbcbc] hover:border-[#f8f8f8] transition-colors bg-[#232326] text-[#e5e5e5] shadow-[0_1px_4px_#bcbcbc33]">
                Αναζήτηση
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MobileDropdownNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-transparent">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between text-lg font-light text-[#bcbcbc] hover:text-[#f8f8f8] transition-colors pb-0.5 focus:outline-none`}
      >
        <span>ΚΟΣΜΗΜΑΤΑ</span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`pl-2 mt-1 flex flex-col gap-1 transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
        <Link href="/collections" className="block py-2 pl-4 text-base text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          Όλα τα Κοσμήματα
        </Link>
        <Link href="/rings" className="block py-2 pl-4 text-base text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          Δαχτυλίδια
        </Link>
        <Link href="/bracelets" className="block py-2 pl-4 text-base text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          Βραχιόλια
        </Link>
        <Link href="/necklaces" className="block py-2 pl-4 text-base text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          Κολιέ
        </Link>
        <Link href="/earrings" className="block py-2 pl-4 text-base text-[#bcbcbc] hover:text-[#f8f8f8] hover:bg-[#232326] rounded transition-colors" onClick={() => setOpen(false)}>
          Σκουλαρίκια
        </Link>
      </div>
    </div>
  );
}
