"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Search, User, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="border-b border-[#bcbcbc] sticky top-0 bg-[#18181b] z-50 shadow-[0_2px_8px_0_rgba(180,180,180,0.04)]">
      <div className="px-2 py-4 mx-auto max-w-7xl sm:px-6">
        <div className="grid items-center w-full grid-cols-3">
          {/* Logo Left */}
          <div className="flex items-center min-w-0">
            <Link href="/" className="text-2xl font-light tracking-wider text-[#e5e5e5] drop-shadow-[0_1px_2px_#bcbcbc55] border-b-2 border-[#bcbcbc] pb-1 px-2 rounded-sm hover:bg-[#232326] transition whitespace-nowrap">
              Πνοή
            </Link>
          </div>
          {/* Centered Menu (hidden placeholder on mobile to keep grid layout) */}
          <nav className="items-center justify-center hidden min-w-0 mx-auto space-x-8 md:flex">
            <Link href="/earrings" className="text-sm font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5">
              ΚΟΣΜΗΜΑΤΑ
            </Link>
            <Link href="/about" className="text-sm font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5">
              ΠΟΙΟΙ ΕΙΜΑΣΤΕ
            </Link>
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
              <Link href="/collections" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΣΥΛΛΟΓΕΣ
              </Link>
              <Link href="/rings" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΔΑΧΤΥΛΙΔΙΑ
              </Link>
              <Link href="/necklaces" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΚΟΛΙΕ
              </Link>
              <Link href="/earrings" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΣΚΟΥΛΑΡΙΚΙΑ
              </Link>
              <Link href="/about" className="text-lg font-light hover:text-[#f8f8f8] text-[#bcbcbc] transition-colors border-b border-transparent hover:border-[#bcbcbc] pb-0.5" onClick={() => setMobileMenuOpen(false)}>
                ΣΧΕΤΙΚΑ
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
