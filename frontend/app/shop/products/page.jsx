"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

// Removed texture/particles/frame for a more minimal look

// Enhanced Product Card

const EnhancedProductCard = ({ product, viewMode }) => {
  const { t } = useTranslation();
  
  return (
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
          {t(product.category)} • {t(product.theme.replace(/-/g, '_'))}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-bold text-slate-300">${product.price}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <button className="px-4 py-2 font-serif transition-colors duration-150 bg-transparent border rounded-md border-slate-300 text-slate-200 hover:bg-slate-300 hover:text-black">
            {t('add_to_cart')}
          </button>
          <button className="px-4 py-2 font-serif text-black transition-colors duration-150 border rounded-md border-slate-300 bg-slate-200 hover:bg-slate-300">
            {t('buy_now')}
          </button>
        </div>
      </div>
    {/* Category label removed for a cleaner card */}
    </motion.div>
  );
};

export default function AllProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Pagination settings - 4 rows with 3 columns = 12 products per page
  const productsPerPage = 12;

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Direct call to FastAPI backend
        const response = await fetch('http://localhost:8000/products/all');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map the backend product structure to the frontend structure
        const mappedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category.toLowerCase(),
          theme: product.sub_category ? product.sub_category.toLowerCase().replace(/_/g, '-') : 'classic',
          image: product.image_url && product.image_url.length > 0 ? product.image_url[0] : "/placeholder-product.jpg"
        }));
        
        setProducts(mappedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const themeMatch = selectedTheme === 'all' || product.theme === selectedTheme;
    return categoryMatch && themeMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTheme]);

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

  const categories = [
    { value: 'all', label: t('all_categories', 'All Categories') },
    { value: 'rings', label: t('rings') },
    { value: 'bracelets', label: t('bracelets') },
    { value: 'necklaces', label: t('necklaces') },
    { value: 'earrings', label: t('earrings') }
  ];

  const themes = [
    { value: 'all', label: t('all_themes', 'All Themes') },
    { value: 'classic', label: t('classic', 'Classic') },
    { value: 'ethnic', label: t('ethnic', 'Ethnic') },
    { value: 'one-of-a-kind', label: t('one_of_a_kind', 'One of a Kind') }
  ];

  // Add loading and error states
  if (loading) {
    return (
      <main className="relative min-h-screen px-4 py-10 mx-auto overflow-x-hidden max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-[#bcbcbc]">
            {t('loading_products', 'Loading products...')}
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
            {t('error_loading_products', 'Error loading products')}
          </div>
          <div className="text-sm text-[#bcbcbc] mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-serif transition-colors duration-150 bg-transparent border rounded-md border-slate-300 text-slate-200 hover:bg-slate-300 hover:text-black"
          >
            {t('retry', 'Retry')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 py-10 mx-auto overflow-x-hidden max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#bcbcbc] tracking-tight text-center w-full">
          {t('all_products', 'All Products')}
        </h1>
      </div>
      <p className="text-lg text-[#bcbcbc] mb-8 text-center max-w-2xl mx-auto">
        {t('all_products_intro', 'Discover our complete collection of handcrafted jewelry')}
      </p>
      {/* Filters and Controls */}
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {/* Theme Filter */}
          <select 
            value={selectedTheme} 
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="bg-[#232326] border border-[#bcbcbc33] text-[#f8f8f8] px-4 py-2 rounded-lg focus:outline-none focus:border-[#bcbcbc55]"
          >
            {themes.map(theme => (
              <option key={theme.value} value={theme.value}>{theme.label}</option>
            ))}
          </select>
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
          {totalPages > 1 && (
            <span className="ml-2">
              • {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages}
            </span>
          )}
        </p>
      </div>
      {/* Products Grid/List */}
      <div 
        className={`product-grid ${viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-t border-[rgba(255,255,255,0.05)]" 
          : "space-y-4 border-t border-[rgba(255,255,255,0.05)]"
        }`}
      >
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
              <Link href={`/shop/${product.category}/${product.id}`} prefetch={false}>
                <EnhancedProductCard product={product} viewMode={viewMode} />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 font-serif transition-colors duration-150 bg-transparent border rounded-md border-slate-300 text-slate-200 hover:bg-slate-300 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex items-center gap-2 px-4 py-2 font-serif transition-colors duration-150 bg-transparent border rounded-md border-slate-300 text-slate-200 hover:bg-slate-300 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
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
    </main>
  );
}
