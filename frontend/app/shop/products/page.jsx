"use client"

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid, List } from "lucide-react";

export default function AllProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { t } = useTranslation();

  // Mock product data - replace with your actual API call
  const allProducts = [
    // Rings
    { id: 1, name: "Elegant Gold Ring", price: 45, category: "rings", theme: "classic", image: "/placeholder-ring.jpg" },
    { id: 2, name: "Ethnic Silver Ring", price: 60, category: "rings", theme: "ethnic", image: "/placeholder-ring.jpg" },
    { id: 3, name: "One of a Kind Ruby Ring", price: 120, category: "rings", theme: "one-of-a-kind", image: "/placeholder-ring.jpg" },
    
    // Bracelets
    { id: 4, name: "Classic Gold Bracelet", price: 80, category: "bracelets", theme: "classic", image: "/placeholder-bracelet.jpg" },
    { id: 5, name: "Ethnic Beaded Bracelet", price: 35, category: "bracelets", theme: "ethnic", image: "/placeholder-bracelet.jpg" },
    { id: 6, name: "Artisan Bracelet", price: 95, category: "bracelets", theme: "one-of-a-kind", image: "/placeholder-bracelet.jpg" },
    
    // Necklaces
    { id: 7, name: "Pearl Necklace", price: 150, category: "necklaces", theme: "classic", image: "/placeholder-necklace.jpg" },
    { id: 8, name: "Tribal Necklace", price: 75, category: "necklaces", theme: "ethnic", image: "/placeholder-necklace.jpg" },
    { id: 9, name: "Designer Statement Piece", price: 200, category: "necklaces", theme: "one-of-a-kind", image: "/placeholder-necklace.jpg" },
    
    // Earrings
    { id: 10, name: "Diamond Studs", price: 85, category: "earrings", theme: "classic", image: "/placeholder-earrings.jpg" },
    { id: 11, name: "Hoop Earrings", price: 45, category: "earrings", theme: "ethnic", image: "/placeholder-earrings.jpg" },
    { id: 12, name: "Artisan Drop Earrings", price: 110, category: "earrings", theme: "one-of-a-kind", image: "/placeholder-earrings.jpg" },
  ];

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const themeMatch = selectedTheme === 'all' || product.theme === selectedTheme;
    return categoryMatch && themeMatch;
  });

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

  return (
    <main className="relative min-h-screen px-4 py-10 mx-auto max-w-7xl">
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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
        </p>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
        : "space-y-4"
      }>
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/shop/${product.category}/${product.id}`} prefetch={false}>
              <div className={viewMode === 'grid' 
                ? "rounded-xl shadow-xl p-4 flex flex-col items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 hover:scale-[1.03] transition-transform hover:border-[#bcbcbc55]"
                : "rounded-xl shadow-xl p-4 flex flex-row items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 hover:scale-[1.01] transition-transform hover:border-[#bcbcbc55] gap-4"
              } style={{boxShadow:'0 8px 32px 0 #23232a55'}}>
                <div className={viewMode === 'grid' 
                  ? "w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                  : "w-24 h-24 bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                }>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="object-cover w-full h-full hover:scale-110 transition-transform" 
                  />
                </div>
                <div className={viewMode === 'grid' ? "text-center" : "flex-1"}>
                  <h3 className="text-lg font-medium text-[#f8f8f8] mb-1">{product.name}</h3>
                  <p className="text-[#bcbcbc] text-sm mb-2 capitalize">
                    {t(product.category)} • {t(product.theme.replace(/-/g, '_'))}
                  </p>
                  <span className="text-[#f8f8f8] font-semibold">${product.price}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#bcbcbc] text-lg">
            {t('no_products_found', 'No products found matching your criteria.')}
          </p>
        </div>
      )}
    </main>
  );
}
