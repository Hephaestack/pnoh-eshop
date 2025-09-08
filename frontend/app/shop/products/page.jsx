"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../cart-context";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "@/components/ui/search-bar";
import { ProductsPageSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import EnhancedPaginationBar from "@/components/ui/EnhancedPaginationBar";

const EnhancedProductCard = ({ product, viewMode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  // Format theme label: prefer translation, fallback to capitalized words
  const formatThemeLabel = (theme) => {
    if (!theme) return "";
    const key = theme.replace(/-/g, "_");
    const translated = t(key);
    // If translation looks like the key or is falsy, fall back to capitalized theme
    if (
      !translated ||
      translated === key ||
      translated.toLowerCase() === key.toLowerCase()
    ) {
      return theme
        .replace(/-/g, " ")
        .split(" ")
        .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
        .join(" ");
    }
    return translated;
  };
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const { addToCart, cart } = useCart();
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [added, setAdded] = useState(false);

  const hideTimerRef = React.useRef(null);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);

    // Immediately show confirmation to match optimistic cart update
    setAdded(true);

    try {
      await addToCart(product.id, 1);
      // leave the added state visible for a short moment after success
      hideTimerRef.current = setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      // rollback UI confirmation on error
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setAdded(false);
  // error handled silently for user-facing flow; preserve rollback
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setBuyingNow(true);

    try {
      await addToCart(product.id, 1);
      router.push('/cart');
    } catch (err) {
      // Error adding to cart, stay on current page
      console.error('Error adding to cart:', err);
    } finally {
      setBuyingNow(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);


  // When cart updates and we had a pending add for this product, show the added confirmation
  // No longer using pendingAdd: we show confirmation immediately and rollback on error.

  return (
    <motion.div
      className={
        viewMode === "grid"
          ? "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group backdrop-blur-md backdrop-saturate-150 transition-transform"
          : "hidden lg:flex relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group flex-row gap-4 items-center p-4 backdrop-blur-md backdrop-saturate-150"
      }
      whileHover={{
        y: -4,
        boxShadow: "0 0 20px 4px rgba(192,192,192,0.25)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      initial={{ y: 0 }}
    >
      <motion.div
        className={
          viewMode === "grid"
            ? "relative w-full aspect-square bg-[#18181b] mb-4 flex items-center justify-center overflow-hidden"
            : "relative w-28 h-28 bg-[#18181b] flex items-center justify-center overflow-hidden flex-shrink-0 rounded-lg"
        }
      >
        {!imgLoaded && (
          <motion.div
            className="absolute inset-0 bg-[#232326]/40 z-10"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`object-cover w-full h-full ${
            imgLoaded ? "" : "opacity-0"
          }`}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
        />
      </motion.div>
      <div
        className={
          viewMode === "grid"
            ? "text-center px-2 pb-2"
            : "flex-1 min-w-0 px-4 py-2"
        }
      >
        <h3 className="mb-1 text-lg font-semibold truncate text-slate-200">
          {product.name}
        </h3>
        <p className="text-[#bcbcbc] text-sm mt-1 truncate font-serif">
          {formatThemeLabel(product.theme)} • {t(product.category)}
        </p>
        <div className="mt-2 font-bold text-slate-300">${product.price}</div>
        {viewMode === "grid" && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <motion.button
              className={`px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 ${
                added ? "bg-green-600 text-white" : ""
              }`}
              whileHover={{
                backgroundColor: added ? "rgb(22 163 74)" : "rgb(203 213 225)",
                color: added ? "#fff" : "rgb(0 0 0)",
                transition: { duration: 0.15 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={adding}
            >
              {added
                ? t("added", "Added!")
                : adding
                ? t("adding", "Adding...")
                : t("add_to_cart")}
            </motion.button>
            <motion.button
              className="px-4 py-2 font-serif text-black border rounded-md border-slate-300 bg-slate-200"
              whileHover={{
                backgroundColor: "rgb(203 213 225)",
                transition: { duration: 0.15 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={buyingNow}
            >
              {buyingNow ? t("buying", "Buying...") : t("buy_now")}
            </motion.button>
          </div>
        )}
      </div>

      {/* Actions column for list view */}
      {viewMode === "list" && (
        <div className="flex items-center justify-end w-full lg:w-auto">
          <div className="flex w-full gap-2 lg:w-auto">
            <motion.button
              className={`w-full lg:w-auto px-3 py-2 text-sm font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 ${
                added ? "bg-green-600 text-white" : ""
              }`}
              whileHover={{
                backgroundColor: added ? "rgb(22 163 74)" : "rgb(203 213 225)",
                color: added ? "#fff" : "rgb(0 0 0)",
                transition: { duration: 0.12 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={adding}
            >
              {added
                ? t("added", "Added!")
                : adding
                ? t("adding", "Adding...")
                : t("add_to_cart")}
            </motion.button>
            <motion.button
              className="w-full px-3 py-2 font-serif text-sm text-black border rounded-md lg:w-auto border-slate-300 bg-slate-200"
              whileHover={{
                backgroundColor: "rgb(203 213 225)",
                transition: { duration: 0.12 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={buyingNow}
            >
              {buyingNow ? t("buying", "Buying...") : t("buy_now")}
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

function AllProductsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]); // Cache all products
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load state
  // Initialize with default values to prevent empty state
  const [categories, setCategories] = useState([
    { value: "all", label: t("all_categories", "All Categories") }
  ]);
  const [subcategories, setSubcategories] = useState([
    { value: "all", label: t("all_themes", "All Themes") }
  ]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || ""); // Initialize from URL
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Add search dropdown state
  const [showSkeleton, setShowSkeleton] = useState(false); // Control skeleton visibility
  const [contentReady, setContentReady] = useState(false); // Track when content is ready to display
  const loadingDelayRef = useRef(null);

  // Pagination settings - 4 rows with 3 columns = 12 products per page
  const productsPerPage = 12;

  // Save current path for smart back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
  sessionStorage.setItem("previousPath", currentPath);
    }
  }, []);

  // Ensure list view is only used on large screens (>= lg)
  useEffect(() => {
    const enforceGridOnResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 1024 && viewMode === "list") {
          setViewMode("grid");
        }
      }
    };
    enforceGridOnResize();
    window.addEventListener("resize", enforceGridOnResize);
    return () => window.removeEventListener("resize", enforceGridOnResize);
  }, [viewMode]);

  // Fetch categories and subcategories from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch categories and subcategories in parallel
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          fetch(`${apiUrl}/categories`, {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }),
          fetch(`${apiUrl}/subcategories`, {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const formattedCategories = [
            { value: "all", label: t("all_categories", "All Categories") },
            ...categoriesData.map((cat) => ({
              value: cat,
              label: t(cat, cat.charAt(0).toUpperCase() + cat.slice(1)),
            })),
          ];
          setCategories(formattedCategories);
        }

        if (subcategoriesRes.ok) {
          const subcategoriesData = await subcategoriesRes.json();
          const formattedSubcategories = [
            { value: "all", label: t("all_themes", "All Themes") },
            ...subcategoriesData.map((sub) => ({
              value: sub.replace(/ /g, "-"), // URL-friendly
              label: t(
                sub.replace(/ /g, "_"),
                sub.charAt(0).toUpperCase() + sub.slice(1)
              ),
            })),
          ];
          setSubcategories(formattedSubcategories);
        }
      } catch (error) {
    // failed to load filters; fall back to hardcoded values below
        // Fallback to hardcoded values if API fails
        setCategories([
          { value: "all", label: t("all_categories", "All Categories") },
          { value: "rings", label: t("rings") },
          { value: "bracelets", label: t("bracelets") },
          { value: "necklaces", label: t("necklaces") },
          { value: "earrings", label: t("earrings") },
          { value: "crosses", label: t("crosses") },
        ]);
        setSubcategories([
          { value: "all", label: t("all_themes", "All Themes") },
          { value: "ethnic", label: t("ethnic", "Ethnic") },
          {
            value: "one-of-a-kind",
            label: t("one_of_a_kind", "One of a Kind"),
          },
          { value: "minimal", label: t("minimal", "Minimal") },
          { value: "luxury", label: t("luxury", "Luxury") },
        ]);
      }
    };

    fetchFilters();
  }, [t]);

  // Fetch ALL products once and filter client-side to make filter UI instant
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Check if we have cached data from sessionStorage
        const cachedProducts = sessionStorage.getItem('allProductsCache_v2');
        const cacheTimestamp = sessionStorage.getItem('allProductsCacheTime_v2');
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
        
        if (cachedProducts && cacheTimestamp && 
            (Date.now() - parseInt(cacheTimestamp)) < cacheExpiry) {
          // Use cached data - no loading needed
          // using cached products silently
          const mappedProducts = JSON.parse(cachedProducts);
          setAllProducts(mappedProducts);
          setContentReady(true);
          setIsInitialLoad(false);
          
          // Signal page ready immediately for cached data
          setTimeout(() => {
            window.dispatchEvent(new Event("page-ready"));
          }, 10);
          return;
        }
        
        // Need to fetch fresh data - show loading
        setLoading(true);
        
        // Show skeleton after a short delay to avoid flash for very fast requests
        const skeletonTimer = setTimeout(() => {
          setShowSkeleton(true);
        }, 150); // Increased delay to 150ms

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/products/all?limit=1000`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        const mappedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category?.toLowerCase(),
          theme: product.sub_category
            ? product.sub_category.toLowerCase().replace(/[_\s]/g, "-")
            : "classic",
          image:
            product.image_url && product.image_url.length > 0
              ? product.image_url[0].replace("dl=0", "raw=1")
              : "/placeholder-product.jpg",
        }));
        
        // Clear skeleton timer if request completed quickly
        clearTimeout(skeletonTimer);
        
        // Cache the fresh data
        sessionStorage.setItem('allProductsCache_v2', JSON.stringify(mappedProducts));
        sessionStorage.setItem('allProductsCacheTime_v2', Date.now().toString());
        
        setAllProducts(mappedProducts);
        setContentReady(true);
        
        // Signal to the root layout that this page is ready
        setTimeout(() => {
          window.dispatchEvent(new Event("page-ready"));
        }, 50);
      } catch (err) {
        // suppressed product fetch error
        setError(err.message);
      } finally {
        setLoading(false);
        setShowSkeleton(false);
        setIsInitialLoad(false);
      }
    };

    fetchAllProducts();
  }, []); // only once on mount

  // Client-side filtering of the cached products (instant)
  const filteredProducts = React.useMemo(() => {
    let items = allProducts || [];
    
    // Apply search filter first
    if (searchQuery.trim()) {
      // The actual filtering will be done by the backend
      // This is just a fallback in case the backend search fails
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
      items = items.filter((product) => {
        return searchTerms.every(term => {
          const productText = [
            product.name,
            product.category,
            product.theme,
            product.description
          ].filter(Boolean).join(' ').toLowerCase();
          return productText.includes(term);
        });
      });
    }
    
    // Then apply category and theme filters
    if (selectedCategory !== "all") {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (selectedTheme !== "all") {
      items = items.filter((p) => p.theme === selectedTheme);
    }
    return items;
  }, [allProducts, selectedCategory, selectedTheme, searchQuery]);

  // Pagination using the filteredProducts (client-side)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const hasMorePages = currentPage < totalPages;

  // Update search query when URL parameters change
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setSearchQuery(urlQuery);
  }, [searchParams]);

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const newUrl = `/shop/products?q=${encodeURIComponent(searchQuery.trim())}`;
      router.replace(newUrl, { scroll: false });
    } else {
      router.replace("/shop/products", { scroll: false });
    }
  }, [searchQuery, router]);

  // Scroll to top when page changes (pagination)
  useEffect(() => {
    if (!isInitialLoad && currentPage > 1) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Scroll to top when filters change (not pagination)
  useEffect(() => {
    if (!isInitialLoad) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [selectedCategory, selectedTheme, isInitialLoad]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    // Use setTimeout to ensure scroll happens after state update
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (hasMorePages) {
      goToPage(currentPage + 1);
    }
  };


  // Show skeleton while loading
  if (showSkeleton || !contentReady) {
    return <ProductsPageSkeleton viewMode={viewMode} />;
  }

  if (error) {
    return (
      <main className="relative min-h-screen px-4 py-10 mx-auto overflow-x-hidden max-w-7xl">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="mb-4 text-lg text-red-500">
            {t("error_loading_products", "Error loading products")}
          </div>
          <div className="text-sm text-[#bcbcbc] mb-4">{error}</div>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200"
            whileHover={{
              backgroundColor: "rgb(203 213 225)",
              color: "rgb(0 0 0)",
              transition: { duration: 0.15 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t("retry", "Retry")}
          </motion.button>
        </div>
      </main>
    );
  }

  // Show skeleton while loading
  if (loading) {
    return <ProductsPageSkeleton viewMode={viewMode} />;
  }

  return (
    <main className="relative min-h-screen px-4 py-10 mx-auto overflow-x-hidden max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#bcbcbc] tracking-tight text-center w-full">
          {t("all_products", "All Products")}
        </h1>
      </div>
      <p className="text-lg text-[#bcbcbc] mb-8 text-center max-w-2xl mx-auto">
        {t(
          "all_products_intro",
          "Discover our complete collection of handcrafted jewelry"
        )}
      </p>
      {/* Filters and Controls */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Search Input - Centered on mobile only */}
        <div className="flex justify-center md:justify-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md md:max-w-xs"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder={t("search_products", "Search products...")}
              variant="default"
              className="w-full"
            />
          </motion.div>
        </div>

        {/* Other Filters */}
        <div className="flex flex-wrap justify-center gap-4 md:flex-row md:justify-start md:items-center">
          {/* Category Filter */}
          <div className="relative">
            <motion.select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`appearance-none bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-[#bcbcbc55] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={!loading ? { borderColor: "rgba(188, 188, 188, 0.4)" } : {}}
              whileFocus={!loading ? { borderColor: "rgba(188, 188, 188, 0.6)" } : {}}
              transition={{ duration: 0.2 }}
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </motion.select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#bcbcbc]">
              {/* Custom dropdown SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          {/* Theme Filter */}
          <div className="relative">
            <motion.select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className={`appearance-none bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-[#bcbcbc55] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={!loading ? { borderColor: "rgba(188, 188, 188, 0.4)" } : {}}
              whileFocus={!loading ? { borderColor: "rgba(188, 188, 188, 0.6)" } : {}}
              transition={{ duration: 0.2 }}
              disabled={loading}
            >
              {subcategories.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </motion.select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#bcbcbc]">
              {/* Custom dropdown SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        {/* View Mode Toggle */}
        <div className="items-center hidden gap-2 lg:flex">
          <motion.button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-[#232326] text-[#f8f8f8]"
                : "text-[#bcbcbc]"
            }`}
            whileHover={{
              color: viewMode !== "grid" ? "rgb(248, 248, 248)" : undefined,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode("list")}
            className={`hidden lg:inline-flex p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-[#232326] text-[#f8f8f8]"
                : "text-[#bcbcbc]"
            }`}
            whileHover={{
              color: viewMode !== "list" ? "rgb(248, 248, 248)" : undefined,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <List className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[#bcbcbc] text-center md:text-left">
          {t("showing_products", "Showing {{count}} products", {
            count: filteredProducts.length,
          })}
          <span className="ml-2">
            • {t("page", "Page")} {currentPage}
          </span>
        </p>
      </div>
      {/* Products Grid/List */}
      <div
        className="relative product-grid"
        style={{ minHeight: "400px" }} // Prevent layout shift
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full"
                : "hidden lg:space-y-4 lg:block w-full"
            }
            layout
          >
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Link
                  href={`/shop/${product.category}/${product.id}`}
                  prefetch={false}
                >
                  <EnhancedProductCard product={product} viewMode={viewMode} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Pagination Controls */}
      {(currentPage > 1 || hasMorePages) && (
        <EnhancedPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onGoToPage={goToPage}
          onGoToPreviousPage={goToPreviousPage}
          onGoToNextPage={goToNextPage}
        />
      )}
      {/* No Results */}
      {currentProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[#bcbcbc] text-lg">
            {t(
              "no_products_found",
              "No products found matching your criteria."
            )}
          </p>
        </div>
      )}
    </main>
  );
}

export default function AllProductsPage() {
  // You can pass token from auth here if needed
  return <AllProductsPageInner />;
}
