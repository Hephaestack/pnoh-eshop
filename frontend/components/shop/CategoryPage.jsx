"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Product Card Component with image optimization
const ProductCard = ({ product, viewMode, categoryTitle, t }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      className={
        viewMode === "grid"
          ? "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group backdrop-blur-md backdrop-saturate-150 transition-transform"
          : "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group flex flex-row gap-4 backdrop-blur-md backdrop-saturate-150 transition-transform"
      }
      whileHover={{ y: -4, boxShadow: "0 0 20px 4px rgba(192,192,192,0.25)" }}
    >
      <div
        className={
          viewMode === "grid"
            ? "relative w-full aspect-square bg-[#18181b] mb-4 flex items-center justify-center overflow-hidden"
            : "relative w-24 h-24 bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
        }
      >
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
      <div
        className={
          viewMode === "grid" ? "text-center px-2 pb-2" : "flex-1 px-2 py-2"
        }
      >
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

export default function CategoryPage({ category }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]); // Cache all products for this category
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const productsPerPage = 12;

  // Save current path for smart back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      sessionStorage.setItem("previousPath", currentPath);
      console.log("CategoryPage - Saved current path:", currentPath);
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
        console.error("Error fetching subcategories:", error);
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
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch ALL products for this category once
        const response = await fetch(
          `${apiUrl}/products/category/${category}`,
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
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategoryProducts();
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
    <main className="relative min-h-screen px-4 py-10 mx-auto max-w-7xl">
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
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-4">
          {/* Theme Filter */}
          <motion.select
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
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

          <motion.button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#232326] text-[#bcbcbc] border border-[#bcbcbc33]"
            whileHover={{
              backgroundColor: "rgb(24, 24, 27)",
              color: "rgb(248, 248, 248)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("filters", "Filters")}
          </motion.button>
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
        className={`relative ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            : "space-y-4"
        }`}
        style={{ minHeight: "400px" }} // Prevent layout shift
        key={`${selectedTheme}-${currentPage}`} // Re-trigger animations on filter change
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
              duration: 0.3,
              delay: index * 0.05, // 50ms delay between items
              ease: "easeOut",
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
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

          {/* Page numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded-md font-serif ${
                  page === currentPage
                    ? "bg-slate-200 text-black"
                    : "border border-slate-300 bg-transparent text-slate-200"
                }`}
                whileHover={
                  page !== currentPage
                    ? {
                        backgroundColor: "rgb(203 213 225)",
                        color: "rgb(0 0 0)",
                        transition: { duration: 0.15 },
                      }
                    : {}
                }
                whileTap={{ scale: 0.98 }}
              >
                {page}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={
              currentPage !== totalPages
                ? {
                    backgroundColor: "rgb(203 213 225)",
                    color: "rgb(0 0 0)",
                    transition: { duration: 0.15 },
                  }
                : {}
            }
            whileTap={currentPage !== totalPages ? { scale: 0.98 } : {}}
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
