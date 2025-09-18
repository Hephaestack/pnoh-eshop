"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid, List } from "lucide-react";

export default function CategoryPage({ category, products }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const { t } = useTranslation();

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

  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
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

  // Filter products by theme
  const filteredProducts =
    selectedTheme === "all"
      ? mockProducts
      : mockProducts.filter((product) => product.theme === selectedTheme);

  const themes = [
    { value: "all", label: t("all_themes", "All Themes") },
    { value: "classic", label: t("classic", "Classic") },
    { value: "ethnic", label: t("ethnic", "Ethnic") },
    { value: "one-of-a-kind", label: t("one_of_a_kind", "One of a Kind") },
  ];

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
      <div className="flex flex-col items-center justify-center gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap justify-center gap-4">
          {/* Theme Filter */}
          <select
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
          >
            {themes.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc33] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("filters", "Filters")}
          </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-[#232326] text-[#f8f8f8]"
                : "text-[#bcbcbc] hover:text-[#f8f8f8]"
            } cursor-pointer`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-[#232326] text-[#f8f8f8]"
                : "text-[#bcbcbc] hover:text-[#f8f8f8]"
            } cursor-pointer`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[#bcbcbc] text-center md:text-left">
          {t("showing_products", "Showing {{count}} products", {
            count: filteredProducts.length,
          })}
        </p>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Product Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/shop/${category}/${product.id}`} className="cursor-pointer">
              <div
                className={
                  viewMode === "grid"
                    ? "rounded-xl shadow-xl p-4 flex flex-col items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 hover:scale-[1.03] transition-transform hover:border-[#bcbcbc55]"
                    : "rounded-xl shadow-xl p-4 flex flex-row items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 hover:scale-[1.01] transition-transform hover:border-[#bcbcbc55] gap-4"
                }
                style={{ boxShadow: "0 8px 32px 0 #23232a55" }}
              >
                <div
                  className={
                    viewMode === "grid"
                      ? "w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                      : "w-24 h-24 bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  }
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform hover:scale-110"
                  />
                </div>
                <div className={viewMode === "grid" ? "text-center" : "flex-1"}>
                  <h3 className="text-lg font-medium text-[#f8f8f8] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#bcbcbc] text-sm mb-2 capitalize">
                    {product.theme && product.theme.toLowerCase() !== (category || '').toLowerCase()
                      ? `${t(product.theme.replace(/-/g, "_"))} • ${categoryInfo.title}`
                      : categoryInfo.title}
                  </p>
                  <span className="text-[#f8f8f8] font-semibold">
                    €{product.price}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
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
        <Link
          href="/products"
          className="px-8 py-3 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc] font-medium cursor-pointer"
        >
          {t("view_all_products", "View All Products")}
        </Link>
      </div>
    </main>
  );
}
