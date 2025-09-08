"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../app/cart-context";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import LoadingIndicator from "@/components/LoadingIndicator";
import { CategoryPageSkeleton } from "@/components/skeletons/CategoryPageSkeleton";
import {
  SlidersHorizontal,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EnhancedPaginationBar from "@/components/ui/EnhancedPaginationBar";

// Format theme label: prefer translation, fallback to capitalized words
const formatThemeLabel = (t, theme) => {
  if (!theme) return "";
  const key = theme.replace(/-/g, "_");
  const translated = t(key);
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

// Product Card Component with image optimization
const ProductCard = ({ product, viewMode, categoryTitle, t }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart, cart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const hideTimerRef = React.useRef(null);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);

    // Immediately show confirmation to match optimistic cart update
    setAdded(true);

    try {
      await addToCart(product.id, 1);
      hideTimerRef.current = setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setAdded(false);
      // suppressed addToCart error
    } finally {
      setAdding(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // No longer using pendingAdd: show confirmation immediately and rollback on error.

  return (
    <motion.div
      className={
        viewMode === "grid"
          ? "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group backdrop-blur-md backdrop-saturate-150 transition-transform"
          : "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden backdrop-blur-md backdrop-saturate-150 transition-transform"
      }
      whileHover={{ y: -4, boxShadow: "0 0 20px 4px rgba(192,192,192,0.25)" }}
    >
      {viewMode === "grid" ? (
        <>
          <div className="relative w-full aspect-square bg-[#18181b] mb-4 flex items-center justify-center overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[#232326]/40 z-10" />
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`object-cover w-full h-full transition-transform duration-200 group-hover:scale-[1.03] ${
                imgLoaded ? "" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
          <div className="px-2 pb-2 text-center">
            <h3 className="text-slate-200 text-lg font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] mb-1">
              {product.name}
            </h3>
            <p className="text-[#bcbcbc] text-sm mb-2 capitalize font-serif">
              {t(product.theme.replace(/-/g, "_"))} • {categoryTitle}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-slate-300">
                ${product.price}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <motion.button
                className={`px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 ${
                  added ? "bg-green-600 text-white" : ""
                }`}
                whileHover={{
                  backgroundColor: added
                    ? "rgb(22 163 74)"
                    : "rgb(203 213 225)",
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
              >
                {t("buy_now")}
              </motion.button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-col items-start hidden gap-4 p-4 sm:flex sm:flex-row sm:items-center">
          <div className="w-full sm:w-28 h-48 sm:h-28 bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[#232326]/40 z-10" />
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`object-cover w-full h-full transition-transform duration-200 group-hover:scale-[1.03] ${
                imgLoaded ? "" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate text-slate-200">
              {product.name}
            </h3>
            <p className="text-[#bcbcbc] text-sm mt-1 truncate font-serif">
              {t(product.theme.replace(/-/g, "_"))} • {categoryTitle}
            </p>
            <div className="mt-2 font-bold text-slate-300">
              ${product.price}
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-3 sm:w-auto sm:justify-end sm:mt-0">
            <div className="flex w-full gap-2 sm:w-auto">
              <motion.button
                className={`w-full sm:w-auto px-3 py-2 text-sm font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 ${
                  added ? "bg-green-600 text-white" : ""
                }`}
                whileHover={{
                  backgroundColor: added
                    ? "rgb(22 163 74)"
                    : "rgb(203 213 225)",
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
                className="w-full px-3 py-2 font-serif text-sm text-black border rounded-md sm:w-auto border-slate-300 bg-slate-200"
                whileHover={{
                  backgroundColor: "rgb(203 213 225)",
                  transition: { duration: 0.12 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {t("buy_now")}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

function CategoryPageInner({ category }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]); // Cache all products for this category
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false); // Start without loading - will be set conditionally
  const [showSkeleton, setShowSkeleton] = useState(false); // Separate skeleton state
  const [error, setError] = useState(null);
  const [contentReady, setContentReady] = useState(false); // Track when content is ready to show
  const { t } = useTranslation();
  const loadingDelayRef = useRef(null);

  const formatThemeLabel = (theme) => {
    if (!theme) return "";
    const key = theme.replace(/-/g, "_");
    const translated = t(key);
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

  const productsPerPage = 12;

  // Save current path for smart back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
  sessionStorage.setItem("previousPath", currentPath);
    }
  }, []);

  // Fetch subcategories from backend
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/subcategories`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (response.ok) {
          const subcategoriesData = await response.json();
          const formattedSubcategories = [
            { value: "all", label: t("all_themes", "All Themes") },
            ...subcategoriesData.map((sub) => ({
              value: sub.replace(/ /g, "-"),
              label: t(
                sub.replace(/ /g, "_"),
                sub.charAt(0).toUpperCase() + sub.slice(1)
              ),
            })),
          ];
          setSubcategories(formattedSubcategories);
        }
  } catch (error) {
        // Fallback to hardcoded values
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

    fetchSubcategories();
  }, [t]);

  // Fetch all products for this category once on component mount
  useEffect(() => {
    const fetchAllCategoryProducts = async () => {
      const cacheKey = `categoryProducts_${category}`;
      
      try {
        // Check if we have cached data for this category
        const cachedProducts = sessionStorage.getItem(cacheKey);
        const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_time`);
        const cacheExpiry = 3 * 60 * 1000; // 3 minutes cache for category pages
        
        if (cachedProducts && cacheTimestamp && 
            (Date.now() - parseInt(cacheTimestamp)) < cacheExpiry) {
          // Use cached data - no loading needed
          const mappedProducts = JSON.parse(cachedProducts);
          setAllProducts(mappedProducts);
          setContentReady(true);
          
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
        }, 150);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch ALL products for this category once
        const response = await fetch(
          `${apiUrl}/products/category/${category}?limit=1000`,
          {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        if (!response.ok) {
              // Handle 404 as empty category (no products found)
              if (response.status === 404) {
                setAllProducts([]);
                setContentReady(true);

                // Signal to the root layout that this page is ready
                setTimeout(() => {
                  window.dispatchEvent(new Event("page-ready"));
                }, 50);
                return;
              }
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
        sessionStorage.setItem(cacheKey, JSON.stringify(mappedProducts));
        sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        
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
      }
    };

    fetchAllCategoryProducts();
    
    return () => {
      if (loadingDelayRef.current) {
        clearTimeout(loadingDelayRef.current);
      }
    };
  }, [category]); // Only refetch when category changes

  // Client-side filtering of cached products
  const filteredProducts = React.useMemo(() => {
    if (selectedTheme === "all") {
      return allProducts;
    }
    return allProducts.filter((product) => product.theme === selectedTheme);
  }, [allProducts, selectedTheme]);

  // Get theme from URL params on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get("theme");
      if (themeParam) {
        setSelectedTheme(themeParam);
      }
    }
  }, []);

  // Update URL when theme changes
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    if (typeof window !== "undefined") {
      const url = new URL(window.location);
      if (theme === "all") {
        url.searchParams.delete("theme");
      } else {
        url.searchParams.set("theme", theme);
      }
      window.history.replaceState({}, "", url);
    }
  };

  // Get category-specific data
  const getCategoryData = (category) => {
    const categoryData = {
      rings: {
        title: t("rings"),
        description: t(
          "rings_category_desc",
          "Discover our beautiful collection of handcrafted rings"
        ),
        placeholder: "/placeholder-ring.jpg",
      },
      bracelets: {
        title: t("bracelets"),
        description: t(
          "bracelets_category_desc",
          "Explore our elegant bracelet collection"
        ),
        placeholder: "/placeholder-bracelet.jpg",
      },
      necklaces: {
        title: t("necklaces"),
        description: t(
          "necklaces_category_desc",
          "Browse our stunning necklace designs"
        ),
        placeholder: "/placeholder-necklace.jpg",
      },
      earrings: {
        title: t("earrings"),
        description: t(
          "earrings_category_desc",
          "Find the perfect earrings for any occasion"
        ),
        placeholder: "/placeholder-earrings.jpg",
      },
      crosses: {
        title: t("crosses"),
        description: t(
          "crosses_category_desc",
          "Discover our sacred collection of handcrafted crosses"
        ),
        placeholder: "/placeholder-cross.jpg",
      },
    };
    return categoryData[category] || categoryData.rings;
  };

  const categoryInfo = getCategoryData(category);

  // Pagination calculations - using filtered products
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    // Scroll to top when theme filter changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [selectedTheme]);

  // Ensure list view is only used on large screens (>= lg)
  useEffect(() => {
    const enforceGridOnResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 1024 && viewMode === "list") {
          setViewMode("grid");
        }
      }
    };
    // Run on mount
    enforceGridOnResize();
    window.addEventListener("resize", enforceGridOnResize);
    return () => window.removeEventListener("resize", enforceGridOnResize);
  }, [viewMode]);

  // Scroll to top when page changes (pagination)
  useEffect(() => {
    if (currentPage > 1) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    // Use setTimeout to ensure scroll happens after state update and re-render
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
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const themes = [
    { value: "all", label: t("all_themes", "All Themes") },
    { value: "classic", label: t("classic", "Classic") },
    { value: "ethnic", label: t("ethnic", "Ethnic") },
    { value: "one-of-a-kind", label: t("one_of_a_kind", "One of a Kind") },
  ];

  // Add loading and error states
  if (loading || showSkeleton) {
    return <CategoryPageSkeleton viewMode={viewMode} />;
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

  return (
    <main 
      className="relative min-h-screen px-4 py-10 mx-auto max-w-7xl transition-opacity duration-300"
      style={{ opacity: contentReady ? 1 : 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#bcbcbc] tracking-tight text-center w-full">
          {categoryInfo.title}
        </h1>
      </div>
      <p className="text-lg text-[#bcbcbc] mb-12 text-center max-w-2xl mx-auto">
        {categoryInfo.description}
      </p>

      {/* Filters and Controls */}
      <div className="flex flex-col items-center justify-center gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        {/* Theme filter - only show for categories that have subcategories */}
        {category !== "crosses" && (
          <div className="relative">
            <motion.select
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="appearance-none bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
              whileHover={{ borderColor: "rgba(188, 188, 188, 0.4)" }}
              whileFocus={{ borderColor: "rgba(188, 188, 188, 0.6)" }}
              transition={{ duration: 0.2 }}
            >
              {subcategories.map((cat) => (
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
        )}

        {/* View Mode Toggle */}
        <div className={`items-center hidden gap-2 lg:flex ${category === "crosses" ? "ml-auto" : ""}`}>
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
          {totalPages > 1 && (
            <span className="ml-2">
              • {t("page", "Page")} {currentPage} {t("of", "of")} {totalPages}
            </span>
          )}
        </p>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 overflow-hidden"
        >
          <div className="p-6 rounded-xl bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 rounded-lg bg-[#18181b] text-[#f8f8f8] border border-[#bcbcbc33]">
                <option>{t("price_range", "Price Range")}</option>
                <option>€0 - €50</option>
                <option>€50 - €100</option>
                <option>€100+</option>
              </select>
              <select className="px-4 py-2 rounded-lg bg-[#18181b] text-[#f8f8f8] border border-[#bcbcbc33]">
                <option>{t("sort_by", "Sort By")}</option>
                <option>{t("price_low_high", "Price: Low to High")}</option>
                <option>{t("price_high_low", "Price: High to Low")}</option>
                <option>{t("newest", "Newest")}</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Grid/List */}
      <div
        style={{ minHeight: "400px" }}
        key={`${selectedTheme}-${currentPage}`}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                : "hidden lg:space-y-4 lg:block"
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
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: index * 0.03,
                }}
              >
                <Link href={`/shop/${category}/${product.id}`}>
                  <ProductCard
                    product={product}
                    viewMode={viewMode}
                    categoryTitle={categoryInfo.title}
                    t={t}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
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

      {/* Back to All Products Link */}
      <div className="flex justify-center mt-12">
        <Link href="/shop/products">
          <motion.div
            className="px-8 py-3 rounded-full bg-[#232326] text-[#bcbcbc] border border-[#bcbcbc] font-medium cursor-pointer"
            whileHover={{
              backgroundColor: "rgb(24, 24, 27)",
              color: "rgb(248, 248, 248)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t("view_all_products", "View All Products")}
          </motion.div>
        </Link>
      </div>
    </main>
  );
}

export default function CategoryPage({ category }) {
  return <CategoryPageInner category={category} />;
}
