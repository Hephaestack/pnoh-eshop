"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryPage({ category, products }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const productsPerPage = 12;

  // Get theme from URL params on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get('theme');
      if (themeParam) {
        setSelectedTheme(themeParam);
      }
    }
  }, []);

  // Update URL when theme changes
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      if (theme === 'all') {
        url.searchParams.delete('theme');
      } else {
        url.searchParams.set('theme', theme);
      }
      window.history.replaceState({}, '', url);
    }
  };

  // Get category-specific data
  const getCategoryData = (category) => {
    const categoryData = {
      rings: {
        title: t('rings'),
        description: t('rings_category_desc', 'Discover our beautiful collection of handcrafted rings'),
        placeholder: '/placeholder-ring.jpg'
      },
      bracelets: {
        title: t('bracelets'),
        description: t('bracelets_category_desc', 'Explore our elegant bracelet collection'),
        placeholder: '/placeholder-bracelet.jpg'
      },
      necklaces: {
        title: t('necklaces'),
        description: t('necklaces_category_desc', 'Browse our stunning necklace designs'),
        placeholder: '/placeholder-necklace.jpg'
      },
      earrings: {
        title: t('earrings'),
        description: t('earrings_category_desc', 'Find the perfect earrings for any occasion'),
        placeholder: '/placeholder-earrings.jpg'
      }
    };
    return categoryData[category] || categoryData.rings;
  };

  const categoryInfo = getCategoryData(category);

  // Mock product data with themes - replace this with your actual product data
  const mockProducts = products || [
    { id: 1, name: `Classic ${categoryInfo.title}`, price: 45, image: categoryInfo.placeholder, theme: 'classic' },
    { id: 2, name: `Ethnic ${categoryInfo.title}`, price: 60, image: categoryInfo.placeholder, theme: 'ethnic' },
    { id: 3, name: `Artisan ${categoryInfo.title}`, price: 120, image: categoryInfo.placeholder, theme: 'one-of-a-kind' },
    { id: 4, name: `Modern ${categoryInfo.title}`, price: 35, image: categoryInfo.placeholder, theme: 'classic' },
    { id: 5, name: `Tribal ${categoryInfo.title}`, price: 85, image: categoryInfo.placeholder, theme: 'ethnic' },
    { id: 6, name: `Designer ${categoryInfo.title}`, price: 150, image: categoryInfo.placeholder, theme: 'one-of-a-kind' },
    { id: 7, name: `Vintage ${categoryInfo.title}`, price: 75, image: categoryInfo.placeholder, theme: 'classic' },
    { id: 8, name: `Bohemian ${categoryInfo.title}`, price: 55, image: categoryInfo.placeholder, theme: 'ethnic' },
    { id: 9, name: `Luxury ${categoryInfo.title}`, price: 200, image: categoryInfo.placeholder, theme: 'one-of-a-kind' },
    { id: 10, name: `Minimalist ${categoryInfo.title}`, price: 40, image: categoryInfo.placeholder, theme: 'classic' },
    { id: 11, name: `Folk ${categoryInfo.title}`, price: 65, image: categoryInfo.placeholder, theme: 'ethnic' },
    { id: 12, name: `Unique ${categoryInfo.title}`, price: 180, image: categoryInfo.placeholder, theme: 'one-of-a-kind' },
    { id: 13, name: `Contemporary ${categoryInfo.title}`, price: 90, image: categoryInfo.placeholder, theme: 'classic' },
    { id: 14, name: `Traditional ${categoryInfo.title}`, price: 70, image: categoryInfo.placeholder, theme: 'ethnic' },
    { id: 15, name: `Exclusive ${categoryInfo.title}`, price: 250, image: categoryInfo.placeholder, theme: 'one-of-a-kind' },
    { id: 16, name: `Elegant ${categoryInfo.title}`, price: 95, image: categoryInfo.placeholder, theme: 'classic' },
  ];

  // Filter products by theme
  const filteredProducts = selectedTheme === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.theme === selectedTheme);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTheme]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top of page
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
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
    { value: 'all', label: t('all_themes', 'All Themes') },
    { value: 'classic', label: t('classic', 'Classic') },
    { value: 'ethnic', label: t('ethnic', 'Ethnic') },
    { value: 'one-of-a-kind', label: t('one_of_a_kind', 'One of a Kind') }
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
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-4">
          {/* Theme Filter */}
          <select 
            value={selectedTheme} 
            onChange={(e) => handleThemeChange(e.target.value)}
            className="bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
          >
            {themes.map(theme => (
              <option key={theme.value} value={theme.value}>{theme.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc33]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filters', 'Filters')}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#232326] text-[#f8f8f8]' : 'text-[#bcbcbc] hover:text-[#f8f8f8]'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#232326] text-[#f8f8f8]' : 'text-[#bcbcbc] hover:text-[#f8f8f8]'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[#bcbcbc]">
          {t('showing_products', 'Showing {{count}} products', { count: filteredProducts.length })}
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
                  <option>{t('price_range', 'Price Range')}</option>
                  <option>€0 - €50</option>
                  <option>€50 - €100</option>
                  <option>€100+</option>
                </select>
                <select className="px-4 py-2 rounded-lg bg-[#18181b] text-[#f8f8f8] border border-[#bcbcbc33]">
                  <option>{t('sort_by', 'Sort By')}</option>
                  <option>{t('price_low_high', 'Price: Low to High')}</option>
                  <option>{t('price_high_low', 'Price: High to Low')}</option>
                  <option>{t('newest', 'Newest')}</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-t border-[rgba(255,255,255,0.05)]" 
        : "space-y-4 border-t border-[rgba(255,255,255,0.05)]"
      }>
        <AnimatePresence mode="popLayout" initial={false}>
          {currentProducts.map((product) => (
            <motion.div
              key={`${product.id}-${currentPage}`}
              layout
              layoutId={`product-${product.id}-page-${currentPage}`}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ 
                duration: 0.3, 
                layout: { type: "spring", stiffness: 500, damping: 40 },
                delay: (currentProducts.indexOf(product) % 12) * 0.05 
              }}
            >
              <Link href={`/shop/${category}/${product.id}`}>
                <motion.div
                  className={viewMode === 'grid'
                    ? "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group backdrop-blur-md backdrop-saturate-150 transition-transform"
                    : "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden group flex flex-row gap-4 backdrop-blur-md backdrop-saturate-150 transition-transform"
                  }
                  whileHover={{ y: -4, boxShadow: "0 0 20px 4px rgba(192,192,192,0.25)" }}
                >
                  <div className={viewMode === 'grid'
                    ? "relative w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                    : "relative w-24 h-24 bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  }>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className={viewMode === 'grid' ? "text-center px-2 pb-2" : "flex-1 px-2 py-2"}>
                    <h3 className="text-slate-200 text-lg font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] mb-1">{product.name}</h3>
                    <p className="text-[#bcbcbc] text-sm mb-2 capitalize font-serif">
                      {t(product.theme.replace(/-/g, '_'))} • {categoryInfo.title}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-bold text-slate-300">€{product.price}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <button className="border border-slate-300 bg-transparent text-slate-200 rounded-md px-4 py-2 transition-colors duration-150 hover:bg-slate-300 hover:text-black font-serif">
                        {t('add_to_cart')}
                      </button>
                      <button className="border border-slate-300 bg-slate-200 text-black rounded-md px-4 py-2 transition-colors duration-150 hover:bg-slate-300 font-serif">
                        {t('buy_now')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex items-center justify-center mt-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 bg-transparent text-slate-200 transition-colors duration-150 hover:bg-slate-300 hover:text-black font-serif disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('previous_page', 'Previous')}
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded-md transition-colors duration-150 font-serif ${
                  page === currentPage
                    ? 'bg-slate-200 text-black'
                    : 'border border-slate-300 bg-transparent text-slate-200 hover:bg-slate-300 hover:text-black'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 bg-transparent text-slate-200 transition-colors duration-150 hover:bg-slate-300 hover:text-black font-serif disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('next_page', 'Next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* No Results */}
      {currentProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[#bcbcbc] text-lg">
            {t('no_products_found', 'No products found matching your criteria.')}
          </p>
        </div>
      )}

      {/* Back to All Products Link */}
      <div className="flex justify-center mt-12">
        <Link 
          href="/shop/products" 
          className="px-8 py-3 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc] font-medium"
        >
          {t('view_all_products', 'View All Products')}
        </Link>
      </div>
    </main>
  );
}
