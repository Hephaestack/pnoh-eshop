"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Fallback items in case API fails - empty array to force API usage
const fallbackItems = [];

export function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Fetch products for hero carousel
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await fetch("http://localhost:8000/products/all");
       
        
        if (response.ok) {
          const products = await response.json();
          
          if (Array.isArray(products) && products.length > 0) {
            console.log(`Found ${products.length} total products in database`);
            
            // Better random shuffle using Fisher-Yates algorithm
            const shuffledProducts = [...products];
            for (let i = shuffledProducts.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
            }
            
            // Take EXACTLY 5 products maximum from the shuffled array
            const selectedProducts = shuffledProducts.slice(0, 5);
            
            console.log(`Randomly selected ${selectedProducts.length} products from ${products.length} total products`);
            console.log('Selected product names:', selectedProducts.map(p => p.name));
            
            // Transform products to carousel items and fix image URLs
            const carouselItems = selectedProducts.map((product, index) => {
              console.log(`Processing product ${index}:`, product.name);
              
              // Convert Dropbox URLs to direct image URLs
              let imageUrl = "/images/test2.jpg"; // Default fallback
              
              if (product.image_url && Array.isArray(product.image_url) && product.image_url.length > 0) {
                let url = product.image_url[0];
                // Convert Dropbox share URL to direct URL
                if (url.includes('dropbox.com') && url.includes('dl=0')) {
                  url = url.replace('dl=0', 'dl=1');
                }
                imageUrl = url;
              } else if (product.image_url && typeof product.image_url === 'string') {
                let url = product.image_url;
                if (url.includes('dropbox.com') && url.includes('dl=0')) {
                  url = url.replace('dl=0', 'dl=1');
                }
                imageUrl = url;
              }
              
              const item = {
                id: product.id || index + 1,
                title: product.name || `Product ${index + 1}`,
                img: imageUrl,
                price: product.price || 0,
                category: product.category,
                description: product.description
              };
              
              console.log(`Processed item ${index}: ${item.title}`);
              return item;
            });
            
            // FORCE exactly 5 items maximum
            const finalItems = carouselItems.slice(0, 5);
            
            console.log(`FINAL: Setting exactly ${finalItems.length} random items in slider`);
            console.log('Final slider items:', finalItems.map(item => item.title));
            setItems(finalItems);
          } else {
            console.log("No products in response or empty array");
            setItems([]);
          }
        } else {
          console.log("API response not ok. Status:", response.status);
          const errorText = await response.text();
          console.log("Error response:", errorText);
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        console.error("Error details:", error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    startAutoplay();
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    startAutoplay();
  }, [items.length]);

  const handleImageClick = () => {
    const currentItem = items[currentIndex];
    if (currentItem?.id && currentItem?.category) {
      router.push(`/shop/${currentItem.category}/${currentItem.id}`);
    }
  };

  const handleTouchStart = (e) => {
    const touchX = e.touches[0].clientX;
    touchStartX.current = touchX;
    touchEndX.current = touchX;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current !== null) {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 30) { // Reduced threshold for easier swiping
      diff > 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const startAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3500);
  }, [items.length]);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(intervalRef.current);
  }, [startAutoplay]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev]);

  return (
  <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
          <div className="text-xl text-white">{t("hero.loading_products")}</div>
        </div>
      )}

      {/* No Products State */}
      {!loading && items.length === 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
          <div className="max-w-md px-4 text-center text-white">
            <h2 className="mb-4 text-2xl">{t("hero.no_products")}</h2>
            <p className="mb-4 text-gray-400">{t("hero.no_products_desc")}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-white transition-all border rounded-lg bg-white/20 border-white/30 hover:bg-white/30"
            >
              {t("hero.retry")}
            </button>
          </div>
        </div>
      )}

      {/* Hero Content - Only show when we have products */}
      {!loading && items.length > 0 && (
        <>
          {/* Swipe Hint for Mobile - Only shown on first load */}
          <div className="absolute z-30 top-1/2 left-4 md:hidden">
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 0, x: 10 }}
              transition={{ delay: 2, duration: 1, repeat: 2, repeatType: "reverse" }}
              className="flex items-center text-sm text-white/60 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              {t("hero.swipe_hint")}
            </motion.div>
          </div>

      {/* Main Image Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleImageClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => clearInterval(intervalRef.current)}
          onMouseLeave={startAutoplay}
        >
          <Image
          sizes="100vw"
            src={items[currentIndex]?.img || "/images/test2.jpg"}
            alt={items[currentIndex]?.title || "Product"}
            fill
            quality={90}
            className="object-cover"
            priority
            onError={(e) => {
              console.log("Image failed to load:", items[currentIndex]?.img);
              console.log("Falling back to test image");
              e.currentTarget.src = "/images/test2.jpg";
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", items[currentIndex]?.img);
            }}
          />
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl text-white"
            >
              <h1 className="mb-2 text-2xl font-light leading-tight tracking-wide sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                {items[currentIndex]?.title || t("hero.loading")}
              </h1>
              <p className="mb-4 text-lg font-light text-gray-200 sm:text-xl md:text-2xl lg:text-3xl">
                ${items[currentIndex]?.price || "0"}
              </p>
              <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick();
                  }}
                  className="w-full px-4 py-2 text-sm text-white transition-all duration-300 border rounded-full sm:w-auto sm:px-6 sm:py-3 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 md:text-base"
                >
                  {t("hero.view_product")}
                </button>
                <Link href="/shop/products" className="w-full sm:w-auto">
                  <button className="w-full px-4 py-2 text-sm text-white transition-all duration-300 bg-transparent border rounded-full sm:w-auto sm:px-6 sm:py-3 border-white/50 hover:bg-white/10 md:text-base">
                    {t("hero.shop_all")}
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Hidden on Mobile */}
      <button
        onClick={handlePrev}
        className="absolute z-20 items-center justify-center hidden w-12 h-12 text-white transition-all duration-300 -translate-y-1/2 border rounded-full md:flex left-4 lg:left-8 top-1/3 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 group"
        aria-label="Previous product"
      >
        <svg className="w-6 h-6 transition-transform lg:w-8 lg:h-8 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute z-20 items-center justify-center hidden w-12 h-12 text-white transition-all duration-300 -translate-y-1/2 border rounded-full md:flex right-4 lg:right-8 top-1/3 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 group"
        aria-label="Next product"
      >
        <svg className="w-6 h-6 transition-transform lg:w-8 lg:h-8 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
  <div className="absolute z-20 flex space-x-2 -translate-x-1/2 bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 left-1/2">
        {items.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              startAutoplay();
            }}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-6 sm:w-8 md:w-10 lg:w-12' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>

      {/* Product Counter */}
      <div className="absolute z-20 px-2 py-1 text-xs text-white rounded-full top-4 sm:top-6 right-4 sm:right-6 bg-black/50 backdrop-blur-sm sm:px-3 sm:py-1 sm:text-sm">
        {currentIndex + 1} / {Math.min(items.length, 5)}
      </div>
        </>
      )}
    </div>
  );
}

export default Hero;
