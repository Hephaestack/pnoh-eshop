"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";

function MegaMenuItem({ href, img, label, onClick }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center w-full max-w-[130px] xl:max-w-[180px] group text-white no-underline justify-self-center"
      style={{ textDecoration: "none" }}
      onClick={onClick}
    >
      <motion.div
        className="w-full aspect-square bg-gradient-to-br from-[#232326] to-[#18181b] rounded-xl overflow-hidden flex items-center justify-center mb-4 border border-[#232326] shadow-[0_2px_12px_0_rgba(30,30,30,0.18)] group-hover:shadow-[0_4px_24px_0_rgba(80,80,80,0.22)] transition-all duration-300"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <motion.img
          src={img}
          alt={label}
          className="w-full h-full object-cover drop-shadow-[0_2px_8px_#00000033]"
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <motion.span
        className="block text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-[#18181b] border border-[#232326] shadow-[0_1px_6px_#23232633] text-white text-center group-hover:bg-[#232326] group-hover:text-[#f8f8f8] transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </Link>
  );
}

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Menu, X, Settings, LogOut, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "./language-switcher";
import { useCart } from "@/app/cart-context";
import SearchBar from "./ui/search-bar";

export function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jewelryOpen, setJewelryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const jewelryRef = useRef(null);
  const headerRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get cart state
  const { cart } = useCart();
  const itemCount = cart?.items?.length || 0;

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() && !isSearching) {
      setIsSearching(true);
      setIsSearchOpen(false);
      router.push(`/shop/products?q=${encodeURIComponent(searchQuery.trim())}`);
      // Reset searching state after navigation
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  // Handle search input key press
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close dropdown on scroll for better UX
  useEffect(() => {
    if (!jewelryOpen) return;
    const handleScroll = () => setJewelryOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [jewelryOpen]);

  // Close dropdown on resize to smaller screens
  useEffect(() => {
    if (!jewelryOpen) return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setJewelryOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [jewelryOpen]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  // Close search dropdown on outside click
  useEffect(() => {
    if (!isSearchOpen) return;
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  // Hide mobile menu if resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll and layout shift when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalOverflowX = document.body.style.overflowX;
      document.body.style.overflow = "hidden";
      document.body.style.overflowX = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
      };
    }
    document.body.style.overflow = "";
    document.body.style.overflowX = "";
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="border-b border-white sticky main-header bg-[#18181b] shadow-[0_2px_8px_0_rgba(180,180,180,0.04)]"
      >
        <div className="flex items-center h-20 px-2 py-2 mx-auto max-w-7xl sm:px-6 md:h-24 lg:h-28">
          <div className="grid items-center w-full h-full grid-cols-3 gap-4">
            {/* Logo Left */}
            <div className="flex items-center justify-start min-w-0">
              <Link href="/" className="flex items-center">
                <img
                  src="/logo.webp"
                  alt={t("logo_alt")}
                  className="h-16 w-auto object-contain drop-shadow-[0_1px_2px_#bcbcbc55] md:h-20 lg:h-22"
                  style={{ maxWidth: "140px" }}
                  priority="true"
                />
              </Link>
            </div>
            {/* Centered Menu (hidden placeholder on mobile to keep grid layout) */}
            <nav className="relative items-center justify-center hidden min-w-0 mx-auto space-x-8 lg:flex shrink-0">
              <Link
                href="/about"
                className="text-md font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                onClick={() => setJewelryOpen(false)}
              >
                {t("about_us")}
              </Link>
              <div className="relative" ref={jewelryRef}>
                {/* Overlay for blur when dropdown is open, but not on header */}
                {jewelryOpen && (
                  <div
                    className="fixed bottom-0 left-0 right-0 z-30 transition-opacity duration-200 opacity-100 bg-black/30 backdrop-blur-sm"
                    style={{
                      top: "var(--total-header-height)",
                      pointerEvents: "auto",
                    }}
                    aria-hidden="true"
                    onClick={() => setJewelryOpen(false)}
                  />
                )}
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={jewelryOpen}
                  onClick={() => setJewelryOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setJewelryOpen((v) => !v);
                    }
                    if (e.key === "Escape") {
                      setJewelryOpen(false);
                    }
                  }}
                  className={`text-md font-light transition-colors pb-0.5 flex items-center gap-1 focus:outline-none text-white hover:text-white`}
                >
                  {t("jewelry")}
                  <motion.svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    animate={{ rotate: jewelryOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-12 bg-[#18181b] border border-[#232326] rounded-2xl shadow-[0_8px_32px_0_#23232a99] ring-1 ring-[#23232a]/30 z-40 transition-all duration-200 ${
                    jewelryOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  } origin-top`}
                  style={{ 
                    boxShadow: "0 8px 32px 0 #23232a99",
                    width: 'max-content'
                  }}
                  role="menu"
                  tabIndex={-1}
                >
                  <div className="grid grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-16 p-6 xl:px-8 w-full max-w-[600px] xl:max-w-none">
                    <MegaMenuItem
                      href="/shop/products"
                      img="/products/allprod.jpeg"
                      label={t("all_products")}
                      onClick={() => setJewelryOpen(false)}
                    />
                    <MegaMenuItem
                      href="/shop/rings"
                      img="/products/ring.jpeg"
                      label={t("rings")}
                      onClick={() => setJewelryOpen(false)}
                    />
                    <MegaMenuItem
                      href="/shop/crosses"
                      img="#"
                      label={t("crosses")}
                      onClick={() => setJewelryOpen(false)}
                    />
                    <MegaMenuItem
                      href="/shop/bracelets"
                      img="/products/bracelet.jpeg"
                      label={t("bracelets")}
                      onClick={() => setJewelryOpen(false)}
                    />
                    <MegaMenuItem
                      href="/shop/necklaces"
                      img="/products/necklace.jpeg"
                      label={t("necklaces")}
                      onClick={() => setJewelryOpen(false)}
                    />
                    <MegaMenuItem
                      href="/shop/earrings"
                      img="/products/earrings.jpeg"
                      label={t("earrings")}
                      onClick={() => setJewelryOpen(false)}
                    />
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                className="text-md font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                onClick={() => setJewelryOpen(false)}
              >
                {t("contact")}
              </Link>
            </nav>
            {/* Placeholder for center column on mobile */}
            <div className="block lg:hidden" />
            {/* Icons Right */}
            <div className="flex items-center justify-end min-w-0 shrink-0">
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <div className="relative" ref={searchRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="hover:bg-[#232326] border border-white rounded-full"
                  >
                    <Search className="w-5 h-5 text-white hover:text-[#f8f8f8] transition-colors" />
                  </Button>
                  {/* Search Dropdown */}
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 sm:right-0 top-12 w-80 sm:w-96 md:w-80 lg:w-80 xl:w-96 bg-[#18181b] border border-[#232326] rounded-lg shadow-xl z-50 p-4 max-w-[calc(100vw-2rem)] left-0 sm:left-auto transform sm:transform-none -translate-x-1/2 sm:translate-x-0"
                      >
                        <SearchBar
                          value={searchQuery}
                          onChange={setSearchQuery}
                          onSubmit={handleSearch}
                          onClear={clearSearch}
                          placeholder={t("search_products")}
                          autoFocus
                          className="w-full"
                        />
                        {searchQuery.trim() && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full mt-2 py-2 px-4 bg-[#232326] text-slate-200 rounded-lg hover:bg-[#2a2a2e] transition-colors disabled:opacity-50"
                            onClick={handleSearch}
                            disabled={isSearching}
                          >
                            {isSearching ? t("searching", "Searching...") : t("search")}
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#232326] border border-white rounded-full relative"
                  >
                    <ShoppingBag className="w-5 h-5 text-white transition-colors hover:text-white" />
                    <AnimatePresence mode="wait">
                      {itemCount > 0 && (
                        <motion.span
                          key={itemCount}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 600,
                            damping: 20,
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[1rem] h-4 flex items-center justify-center px-1 border border-white shadow-[0_0_4px_#bcbcbc99] font-semibold"
                          aria-live="polite"
                        >
                          {itemCount > 99 ? "99+" : itemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              </div>
              
              {/* Account Icon - separated with gap */}
              <div className="relative ml-8" ref={userMenuRef}>
                {isSignedIn ? (
                  <div>
                    {/* User Avatar Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="size-9 border-2 border-white rounded-full hover:border-[#f8f8f8] transition-colors flex items-center justify-center p-0 overflow-hidden"
                    >
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.firstName || 'User'}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full font-semibold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                          {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                        </div>
                      )}
                    </Button>

                    {/* Custom Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-12 w-64 bg-[#18181b] border border-[#232326] rounded-lg shadow-xl z-50"
                        >
                          {/* User Info Header */}
                          <div className="p-4 border-b border-[#232326]">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#232326]">
                                {user?.imageUrl ? (
                                  <img
                                    src={user.imageUrl}
                                    alt={user.firstName || 'User'}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full font-semibold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">
                                  {user?.firstName && user?.lastName 
                                    ? `${user.firstName} ${user.lastName}`
                                    : user?.firstName || 'User'
                                  }
                                </p>
                                <p className="text-sm text-gray-400 truncate">
                                  {user?.emailAddresses?.[0]?.emailAddress || ''}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link href="/account" onClick={() => setUserMenuOpen(false)}>
                              <div className="flex items-center px-4 py-3 text-white hover:bg-[#232326] transition-colors cursor-pointer">
                                <Settings className="w-5 h-5 mr-3" />
                                <span className="font-medium">Manage account</span>
                              </div>
                            </Link>
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                signOut();
                              }}
                              className="w-full flex items-center px-4 py-3 text-white hover:bg-[#232326] transition-colors"
                            >
                              <LogOut className="w-5 h-5 mr-3" />
                              <span className="font-medium">Sign out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/auth/sign-in">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-[#232326] border border-white rounded-full"
                    >
                      <User className="w-5 h-5 text-white transition-colors hover:text-white" />
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Mobile Menu Button - only visible on mobile */}
              <div className="ml-4 lg:hidden">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#232326] border border-white rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#18181b]"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label={mobileMenuOpen ? t("close_menu") : t("open_menu")}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mobileMenuOpen ? "close" : "open"}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {mobileMenuOpen ? (
                          <X className="w-6 h-6 text-white" />
                        ) : (
                          <Menu className="w-6 h-6 text-white" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - outside header for full viewport slide-in effect */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Mobile Menu Panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-80 bg-[#18181b] border-l border-white shadow-xl flex flex-col overflow-y-auto pt-20"
            >
              {/* Header with close button - positioned higher */}
              <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-white/20">
                <h2 className="text-xl font-medium text-white">Μενού</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#232326] border border-white rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t("close_menu")}
                >
                  <X className="w-6 h-6 text-white" />
                </Button>
              </div>

              <div className="flex flex-col flex-1 gap-6 p-6">
                <MobileDropdownNav
                  onLinkClick={() => setMobileMenuOpen(false)}
                />
                <Link
                  href="/about"
                  className="text-lg font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("about_us")}
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("contact")}
                </Link>
                <Link
                  href="/cart"
                  className="text-lg font-light text-white hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Καλάθι {itemCount > 0 && `(${itemCount})`}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileDropdownNav({ onLinkClick }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="border-b border-white/20">
      <motion.button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between text-lg font-light text-white hover:text-white transition-colors py-3 focus:outline-none`}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <span>{t("jewelry")}</span>
        <motion.svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-4 space-y-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/shop/products"
                  className="block py-3 pl-4 text-base text-white/90 hover:text-white hover:bg-[#232326] rounded-lg transition-all duration-200 active:bg-[#2a2a2e]"
                  onClick={handleLinkClick}
                >
                  {t("all_jewelry")}
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/shop/rings"
                  className="block py-3 pl-4 text-base text-white/90 hover:text-white hover:bg-[#232326] rounded-lg transition-all duration-200 active:bg-[#2a2a2e]"
                  onClick={handleLinkClick}
                >
                  {t("rings")}
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/shop/crosses"
                  className="block py-3 pl-4 text-base text-white/90 hover:text-white hover:bg-[#232326] rounded-lg transition-all duration-200 active:bg-[#2a2a2e]"
                  onClick={handleLinkClick}
                >
                  {t("crosses")}
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/shop/bracelets"
                  className="block py-3 pl-4 text-base text-white/90 hover:text-white hover:bg-[#232326] rounded-lg transition-all duration-200 active:bg-[#2a2a2e]"
                  onClick={handleLinkClick}
                >
                  {t("bracelets")}
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Link
                  href="/shop/necklaces"
                  className="block py-3 pl-4 text-base text-white/90 hover:text-white hover:bg-[#232326] rounded-lg transition-all duration-200 active:bg-[#2a2a2e]"
                  onClick={handleLinkClick}
                >
                  {t("necklaces")}
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/shop/earrings"
                  className="block py-3 pl-4 text-base text-white/90 hover:text-white hover:bg-[#232326] rounded-lg transition-all duration-200 active:bg-[#2a2a2e]"
                  onClick={handleLinkClick}
                >
                  {t("earrings")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
