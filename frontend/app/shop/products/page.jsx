"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

const EnhancedProductCard = ({ product, viewMode }) => {
  const { t } = useTranslation();
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <motion.div
      className={
        viewMode === "grid"
          ? "relative border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group backdrop-blur-md backdrop-saturate-150"
          : "relative border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group flex flex-row gap-4 backdrop-blur-md backdrop-saturate-150"
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
            : "relative w-24 h-24 bg-[#18181b] flex items-center justify-center overflow-hidden flex-shrink-0"
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
          viewMode === "grid" ? "text-center px-2 pb-2" : "flex-1 px-2 py-2"
        }
      >
        <h3 className="text-slate-200 text-lg font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] mb-1">
          {product.name}
        </h3>
        <p className="text-[#bcbcbc] text-sm mb-2 capitalize font-serif">
          {t(product.category)} • {t(product.theme.replace(/-/g, "_"))}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-bold text-slate-300">
            ${product.price}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <motion.button
            className="px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200"
            whileHover={{
              backgroundColor: "rgb(203 213 225)",
              color: "rgb(0 0 0)",
              transition: { duration: 0.15 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t("add_to_cart")}
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
    </motion.div>
  );
};

export default function AllProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]); // Cache all products
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Pagination settings - 4 rows with 3 columns = 12 products per page
  const productsPerPage = 12;

  // Save current path for smart back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      sessionStorage.setItem("previousPath", currentPath);
      console.log("AllProductsPage - Saved current path:", currentPath);
    }
  }, []);

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
              value: sub.replace(/ /g, "-"), // Store with dashes for URL-friendly format
              label: t(
                sub.replace(/ /g, "_"), // Use underscores for translation keys
                sub.charAt(0).toUpperCase() + sub.slice(1)
              ),
            })),
          ];
          setSubcategories(formattedSubcategories);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
        // Fallback to hardcoded values if API fails
        setCategories([
          { value: "all", label: t("all_categories", "All Categories") },
          { value: "rings", label: t("rings") },
          { value: "bracelets", label: t("bracelets") },
          { value: "necklaces", label: t("necklaces") },
          { value: "earrings", label: t("earrings") },
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

  // Fetch products based on filters and pagination
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        // Only show loading state on initial load or if it takes more than 300ms
        let loadingTimeout;
        if (isInitialLoad) {
          setLoading(true);
        } else {
          loadingTimeout = setTimeout(() => {
            setLoading(true);
          }, 300); // Show loading only if request takes longer than 300ms
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Calculate skip value based on current page
        const skip = (currentPage - 1) * productsPerPage;
        const limit = productsPerPage;

        let url;

        // Determine which API endpoint to use based on filters
        if (selectedCategory !== "all" && selectedTheme !== "all") {
          // Both category and theme selected
          const categoryValue = selectedCategory;
          const themeValue = selectedTheme.replace(/-/g, " "); // Convert back to backend format (spaces)
          url = `${apiUrl}/products/category/${categoryValue}/subcategory/${encodeURIComponent(
            themeValue
          )}?skip=${skip}&limit=${limit}`;
        } else if (selectedCategory !== "all") {
          // Only category selected
          url = `${apiUrl}/products/category/${selectedCategory}?skip=${skip}&limit=${limit}`;
        } else if (selectedTheme !== "all") {
          // Only theme selected
          const themeValue = selectedTheme.replace(/-/g, " "); // Convert back to backend format (spaces)
          url = `${apiUrl}/products/subcategory/${encodeURIComponent(
            themeValue
          )}?skip=${skip}&limit=${limit}`;
        } else {
          // No filters selected - get all products
          url = `${apiUrl}/products/all?skip=${skip}&limit=${limit}`;
        }

        console.log("Fetching from URL:", url); // Debug log

        const response = await fetch(url, {
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
        setAllProducts(mappedProducts);

        // Clear the loading timeout if request completed quickly
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setIsInitialLoad(false); // Mark initial load as complete
      }
    };
    fetchFilteredProducts();
  }, [currentPage, selectedCategory, selectedTheme, isInitialLoad]); // Refetch when page or filters change

  // Since we're using backend filtering, filteredProducts is the same as allProducts
  const filteredProducts = allProducts;

  // For server-side pagination, we need to estimate total pages
  // Since we don't know the total count, we'll show next page button if current page has full results
  const hasMorePages = allProducts.length === productsPerPage;
  const currentProducts = filteredProducts;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTheme]);

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
    // Smooth scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  // Add loading and error states
  if (loading) {
    return (
      <main className="relative min-h-screen px-4 py-10 mx-auto overflow-x-hidden max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-[#bcbcbc]">
            {t("loading_products", "Loading products...")}
          </div>
        </div>
      </main>
    );
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
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <motion.select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
            whileHover={{ borderColor: "rgba(188, 188, 188, 0.4)" }}
            whileFocus={{ borderColor: "rgba(188, 188, 188, 0.6)" }}
            transition={{ duration: 0.2 }}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </motion.select>
          {/* Theme Filter */}
          <motion.select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
            whileHover={{ borderColor: "rgba(188, 188, 188, 0.4)" }}
            whileFocus={{ borderColor: "rgba(188, 188, 188, 0.6)" }}
            transition={{ duration: 0.2 }}
          >
            {subcategories.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </motion.select>
        </div>
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
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
            className={`p-2 rounded-lg ${
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
        <p className="text-[#bcbcbc]">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedTheme}-${currentPage}`} // Re-trigger animations on filter/page change
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full"
                : "space-y-4 w-full"
            }
          >
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05, // 50ms delay between items
                  ease: "easeOut",
                }}
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

      {/* Pagination Controls */}
      {(currentPage > 1 || hasMorePages) && (
        <motion.div
          className="flex items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={
              currentPage !== 1
                ? {
                    backgroundColor: "rgb(203 213 225)",
                    color: "rgb(0 0 0)",
                    transition: { duration: 0.15 },
                  }
                : {}
            }
            whileTap={currentPage !== 1 ? { scale: 0.98 } : {}}
          >
            <ChevronLeft className="w-4 h-4" />
            {t("previous_page", "Previous")}
          </motion.button>

          {/* Current page indicator */}
          <span className="px-4 py-2 text-slate-200">
            {t("page", "Page")} {currentPage}
          </span>

          <motion.button
            onClick={goToNextPage}
            disabled={!hasMorePages}
            className="flex items-center gap-2 px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={
              hasMorePages
                ? {
                    backgroundColor: "rgb(203 213 225)",
                    color: "rgb(0 0 0)",
                    transition: { duration: 0.15 },
                  }
                : {}
            }
            whileTap={hasMorePages ? { scale: 0.98 } : {}}
          >
            {t("next_page", "Next")}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
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
