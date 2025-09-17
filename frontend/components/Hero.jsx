"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Fallback items in case API fails - empty array to force API usage
const fallbackItems = [];

// Cache for products to avoid refetching on navigation
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState(() => {
    // Initialize with cached data if available
    return productsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION 
      ? productsCache 
      : [];
  });
  const [loading, setLoading] = useState(() => {
    // Start with false if we have cached data
    return !productsCache || (Date.now() - cacheTimestamp) > CACHE_DURATION;
  });
  const [showContent, setShowContent] = useState(false);
  const intervalRef = useRef();
  // true: active on right, false: active on left
  const [tabletActiveRight, setTabletActiveRight] = useState(true);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const carouselRef = useRef(null);

  // Fetch products for hero carousel with caching
  useEffect(() => {
    const fetchProducts = async () => {
      // Check if we have valid cached data
      if (productsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        setItems(productsCache);
        setLoading(false);
        // Small delay to ensure smooth fade-in
        setTimeout(() => setShowContent(true), 50);
        return;
      }

      setLoading(true);
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/all`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (response.ok) {
          const products = await response.json();

          if (Array.isArray(products) && products.length > 0) {
            // Better random shuffle using Fisher-Yates algorithm
            const shuffledProducts = [...products];
            for (let i = shuffledProducts.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [
                shuffledProducts[i],
                shuffledProducts[j],
              ] = [shuffledProducts[j], shuffledProducts[i]];
            }

            // Take EXACTLY 10 products maximum from the shuffled array
            const selectedProducts = shuffledProducts.slice(0, 10);

            // Transform products to carousel items and fix image URLs
            const carouselItems = selectedProducts.map((product, index) => {
              // Convert Dropbox URLs to direct image URLs
              let imageUrl = "/images/test2.jpg"; // Default fallback

              // Prefer high-resolution original if available (e.g., big_image_url)
              if (
                product.big_image_url &&
                Array.isArray(product.big_image_url) &&
                product.big_image_url.length > 0
              ) {
                let url = product.big_image_url[0];
                if (url.includes("dropbox.com") && url.includes("dl=0")) {
                  url = url.replace("dl=0", "raw=1");
                }
                imageUrl = url;
              } else if (
                product.image_url &&
                Array.isArray(product.image_url) &&
                product.image_url.length > 0
              ) {
                let url = product.image_url[0];
                // Convert Dropbox share URL to direct URL
                if (url.includes("dropbox.com") && url.includes("dl=0")) {
                  url = url.replace("dl=0", "raw=1");
                }
                imageUrl = url;
              } else if (product.image_url && typeof product.image_url === "string") {
                let url = product.image_url;
                if (url.includes("dropbox.com") && url.includes("dl=0")) {
                  url = url.replace("dl=0", "raw=1");
                }
                imageUrl = url;
              }

              const item = {
                id: product.id || index + 1,
                title: product.name || `Product ${index + 1}`,
                img: imageUrl,
                price: product.price || 0,
                category: product.category ? product.category.toLowerCase() : 'rings',
                description: product.description,
              };

              return item;
            });

            // FORCE exactly 10 items maximum
            const finalItems = carouselItems.slice(0, 10);

            // Cache the processed items
            productsCache = finalItems;
            cacheTimestamp = Date.now();
            
            setItems(finalItems);

            // Preload first few images for better performance
            finalItems.slice(0, 3).forEach((item, index) => {
              if (item.img && !item.img.includes("/images/test2.jpg")) {
                const preloadImg = document.createElement("img");
                preloadImg.src = item.img;
              }
            });
          } else {
            setItems([]);
            productsCache = [];
            cacheTimestamp = Date.now();
          }
        } else {
          setItems([]);
          productsCache = [];
          cacheTimestamp = Date.now();
        }
      } catch (error) {
        setItems([]);
        productsCache = [];
        cacheTimestamp = Date.now();
      } finally {
        setLoading(false);
        // Delay showing content to ensure smooth fade-in
        setTimeout(() => setShowContent(true), 100);
      }
    };

    fetchProducts();
  }, []);

  // Initialize showContent for cached data
  useEffect(() => {
    if (!loading && items.length > 0) {
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading, items.length]);

  const handlePrev = useCallback(() => {
    // On manual prev, flip the active side and advance index if needed
    setTabletActiveRight((prev) => !prev);
    // If flipping to right, advance index
    setCurrentIndex((prevIndex) => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (width >= 768 && width < 1280 && items.length >= 2) {
        return tabletActiveRight ? (prevIndex - 1 + items.length) % items.length : prevIndex;
      }
      return (prevIndex - 1 + items.length) % items.length;
    });
    startAutoplay();
  }, [items.length, tabletActiveRight]);

  const handleNext = useCallback(() => {
    // On manual next, flip the active side and advance index if needed
    setTabletActiveRight((prev) => !prev);
    setCurrentIndex((prevIndex) => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (width >= 768 && width < 1280 && items.length >= 2) {
        return tabletActiveRight ? prevIndex : (prevIndex + 1) % items.length;
      }
      return (prevIndex + 1) % items.length;
    });
    startAutoplay();
  }, [items.length, tabletActiveRight]);

  const handleImageClick = () => {
    const currentItem = items[currentIndex];
    if (currentItem?.id && currentItem?.category) {
      // Ensure category is properly formatted for the route
      const category = currentItem.category.toLowerCase().trim();
      const productId = currentItem.id;
      
      // Navigate to the product page
      router.push(`/shop/${category}/${productId}`);
    }
  };

  const handleTouchStart = (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    touchStartX.current = touchX;
    touchEndX.current = touchX;
    touchStartY.current = touchY;
    touchEndY.current = touchY;
    // Pause autoplay during touch interaction
    clearInterval(intervalRef.current);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current !== null) {
      touchEndX.current = e.touches[0].clientX;
      // Don't call preventDefault - React events are passive
    }
  };

  const handleTouchEnd = (e) => {
    // Get end touch coords from event if available
    let endX = touchEndX.current;
    let endY = touchEndY.current;
    if (e && e.changedTouches && e.changedTouches[0]) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    }

    // If there's an element under the finger, focus that slide
    try {
      const el = document.elementFromPoint(endX, endY);
      const slide = el && el.closest && el.closest('[data-index]');
      if (slide && slide.dataset && typeof slide.dataset.index !== 'undefined') {
        const idx = parseInt(slide.dataset.index, 10);
        if (!isNaN(idx)) {
          // When a slide is chosen via touch, make it the active-right on tablet by default
          setTabletActiveRight(true);
          setCurrentIndex(idx);
          startAutoplay();
          touchStartX.current = null;
          touchEndX.current = null;
          touchStartY.current = null;
          touchEndY.current = null;
          return;
        }
      }
    } catch (err) {
      // ignore DOM errors and fallback to diff logic
    }

    // Fallback to directional swipe if no element found
    if (touchStartX.current !== null && endX !== null) {
      const diff = touchStartX.current - endX;
      const minSwipeDistance = 50;

      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          handleNext(); // Swipe left = next
        } else {
          handlePrev(); // Swipe right = previous
        }
      } else {
        // If no swipe detected, restart autoplay
        startAutoplay();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const startAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (width >= 768 && width < 1280 && items.length >= 2) {
        setTabletActiveRight((prev) => !prev);
        setCurrentIndex((prevIndex) => {
          // If flipping to right, advance index
          return tabletActiveRight ? (prevIndex + 1) % items.length : prevIndex;
        });
      } else {
        setTabletActiveRight(true);
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }
    }, 3500);
  }, [items.length, tabletActiveRight]);

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
    <motion.div 
      className="relative w-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black overflow-hidden"
      style={{ minHeight: "calc(100vh - var(--total-header-height))" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: showContent ? 1 : 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      {/* Enhanced Multi-layer Background with Silver Tones */}
      <div className="absolute inset-0">
        {/* Primary depth layer with silver accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(192,192,192,0.08),_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(169,169,169,0.06),_transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(128,128,128,0.1),_transparent_50%)]"></div>

        {/* Secondary depth layer with silver shimmer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(192,192,192,0.05),_transparent_50%)] opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(211,211,211,0.04),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(169,169,169,0.03),_transparent_50%)]"></div>

        {/* Animated silver particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-silver-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                boxShadow: '0 0 4px rgba(192,192,192,0.3)'
              }}
            />
          ))}
        </div>

        {/* Silver mesh overlay */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Subtle noise texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Bottom blend gradient to match next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#18181b] via-[#18181b]/80 to-transparent z-10"></div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - var(--total-header-height))" }}>
          <div className="p-8 text-center bg-neutral-900/40 backdrop-blur-lg rounded-2xl border border-neutral-700/30">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-neutral-500/40 border-t-neutral-400 rounded-full animate-spin"></div>
            <div className="text-lg text-neutral-300">
              {t("hero.loading_products")}
            </div>
          </div>
        </div>
      )}

      {/* No Products State - Only show after content is ready to prevent flash */}
      {!loading && showContent && items.length === 0 && (
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - var(--total-header-height))" }}>
          <div className="max-w-md p-8 text-center bg-neutral-900/40 backdrop-blur-lg rounded-2xl border border-neutral-700/30">
            <h2 className="mb-4 text-2xl font-light text-neutral-200">
              {t("hero.no_products")}
            </h2>
            <p className="mb-6 text-neutral-400">
              {t("hero.no_products_desc")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-neutral-200 transition-all duration-300 bg-neutral-800/50 backdrop-blur-sm border border-neutral-600/40 rounded-xl hover:bg-neutral-700/60 hover:scale-105"
            >
              {t("hero.retry")}
            </button>
          </div>
        </div>
      )}

      {/* Hero Content - Horizontal Carousel */}
      {!loading && showContent && items.length > 0 && (
        <div
          className="relative flex items-center p-4 md:p-8 touch-pan-y"
          style={{ touchAction: "pan-y", minHeight: "calc(100vh - var(--total-header-height))" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => clearInterval(intervalRef.current)}
          onMouseLeave={startAutoplay}
        >
          {/* Swipe Hint for Mobile */}
          <div className="absolute z-30 top-8 left-8 md:hidden">
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 0, x: 10 }}
              transition={{
                delay: 2,
                duration: 1,
                repeat: 2,
                repeatType: "reverse",
              }}
              className="flex items-center text-sm text-neutral-400 bg-neutral-900/30 backdrop-blur-lg px-4 py-2 rounded-full border border-neutral-700/30"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              {t("hero.swipe_hint")}
            </motion.div>
          </div>

          {/* Navigation Arrows - Hidden on Mobile */}
          <style jsx>{`
            @media (pointer: fine) {
              .hero-arrow-btn { display: flex !important; }
            }
            @media (pointer: coarse) {
              .hero-arrow-btn { display: none !important; }
            }
          `}</style>
          <button
            onClick={handlePrev}
            className="hero-arrow-btn absolute z-30 left-4 md:left-8 p-3 md:p-4 text-neutral-300 transition-all duration-300 bg-neutral-900/30 backdrop-blur-lg border border-neutral-700/30 rounded-full hover:bg-neutral-800/50 hover:scale-110 group shadow-xl hidden md:flex items-center justify-center cursor-pointer"
            aria-label="Previous product"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="hero-arrow-btn absolute z-30 right-4 md:right-8 p-3 md:p-4 text-neutral-300 transition-all duration-300 bg-neutral-900/30 backdrop-blur-lg border border-neutral-700/30 rounded-full hover:bg-neutral-800/50 hover:scale-110 group shadow-xl hidden md:flex items-center justify-center cursor-pointer"
            aria-label="Next product"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Horizontal Carousel */}
          <div className="relative w-full max-w-7xl mx-auto px-4 md:px-0">
            <div className="flex items-center justify-center md:space-x-8">
              {items.map((item, index) => {
                // Determine the active index to display. On tablet (2-card) view we may want
                // the active card to be the left or right one depending on `tabletActiveRight`.
                let displayActiveIndex = currentIndex;
                let width = typeof window !== 'undefined' ? window.innerWidth : 1024;

                const isTabletTwoUp = width >= 768 && width < 1280 && items.length >= 2;
                if (isTabletTwoUp) {
                  if (tabletActiveRight) {
                    // active sits on the right (default): displayActiveIndex = currentIndex
                    displayActiveIndex = currentIndex;
                  } else {
                    // active sits on the left: make the left card the active one
                    displayActiveIndex = (currentIndex - 1 + items.length) % items.length;
                  }
                }

                const isActive = index === displayActiveIndex;
                const isPrev = index === (displayActiveIndex - 1 + items.length) % items.length;
                const isNext = index === (displayActiveIndex + 1) % items.length;

                // Visibility rules depend on breakpoints:
                // - Desktop (>=1280): show prev + active + next
                // - Tablet (>=768 && <1280): show the pair containing the active (either prev+active or active+next)
                // - Mobile: show only active
                let isVisible = false;
                if (isTabletTwoUp) {
                  // If active is on the right, show prev + active. If active is on the left, show active + next.
                  isVisible = tabletActiveRight ? (isActive || isPrev) : (isActive || isNext);
                } else if (width >= 1280) {
                  isVisible = isActive || isPrev || isNext;
                } else if (width >= 0) {
                  isVisible = isActive;
                }

                if (!isVisible) return null;

                // Add gap between cards (only next and prev)
                let cardGap = '';
                if (isPrev) cardGap = 'mr-16';
                if (isNext) cardGap = 'ml-16';

                return (
                  <motion.div
                    key={item.id}
                    data-index={index}
                    className={`relative ${cardGap} transition-all duration-900 ease-in-out ${
                      isActive
                        ? "scale-100 z-20 cursor-pointer flex justify-center"
                        : "scale-75 md:scale-85 z-10 hover:scale-80 md:hover:scale-90 block md:block md:cursor-pointer"
                    }`}
                    onClick={() => {
                      if (isActive) {
                        handleImageClick();
                      } else {
                        setCurrentIndex(index);
                        startAutoplay();
                      }
                    }}
                    initial={false}
                    animate={{
                      // small, fast fade + pop effect
                      // Do not blur inactive slides so their images render at full quality.
                      opacity: isActive ? 1 : 0.8,
                      y: isActive ? 0 : 6,
                      // slight pop on active, subtle shrink on inactive
                      scale: isActive ? 1.02 : 0.95,
                    }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    {/* Glass Card Container with Silver Accents */}
                    <div
                      className={`relative backdrop-blur-lg border rounded-3xl overflow-hidden shadow-2xl transition-all duration-900 ${
                        isActive 
                          ? "bg-gradient-to-br from-neutral-900/30 via-neutral-800/20 to-neutral-900/30 border-silver-400/30 shadow-silver-500/20" 
                          : "bg-gradient-to-br from-neutral-900/20 via-neutral-800/15 to-neutral-900/20 border-neutral-700/30 shadow-black/30"
                      }`}
                      style={{
                        boxShadow: isActive 
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(192, 192, 192, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                          : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(115, 115, 115, 0.1)'
                      }}
                    >
                      {/* Image Container with Silver Frame */}
                      <div className={`relative w-80 sm:w-96 md:w-80 lg:w-[440px] xl:w-[480px] h-96 sm:h-[450px] md:h-96 lg:h-[520px] xl:h-[560px] mx-auto ${
                        isActive ? 'ring-1 ring-silver-400/20' : ''
                      }`}>
                        {/* Silver inner glow for active item */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver-400/5 to-transparent animate-pulse"></div>
                        )}
                        {
                          /* Balance quality vs performance:
                             - Active and adjacent slides: high-quality, high-priority, eager loading.
                             - Other visible slides: medium quality and leave optimization to Next.js to save bandwidth.
                          */
                        }
                        <Image
                          src={item.img || "/images/test2.jpg"}
                          alt={item.title || "Product"}
                          fill
                          sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 440px, (max-width: 1280px) 640px, 960px"
                          quality={isActive ? 100 : (isPrev || isNext ? 95 : 70)}
                          className="object-cover"
                          priority={isActive || isPrev || isNext}
                          loading={isActive || isPrev || isNext ? "eager" : "lazy"}
                          // Use unoptimized for the active slide to get the original image fidelity; adjacent slides optionally unoptimized
                          unoptimized={isActive ? true : (isPrev || isNext ? true : false)}
                          fetchPriority={isActive || isPrev || isNext ? "high" : "auto"}
                          decoding="async"
                          onError={(e) => {
                            try { e.currentTarget.src = "/images/test2.jpg"; } catch (err) { /* ignore */ }
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>

                      {/* Product Info - Only show on active item */}
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.22 }}
                            className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
                          >
                            <h1 className="mb-3 text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-100 leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] shadow-black">
                              {item.title}
                            </h1>
                            <p className="mb-6 text-xl md:text-2xl lg:text-3xl font-bold text-neutral-200 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] shadow-black">
                              €{item.price}
                            </p>
                            <div className="flex flex-col w-full space-y-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageClick();
                                }}
                                className="w-full px-6 py-3 text-sm md:text-base font-semibold text-neutral-200 transition-all duration-300 bg-neutral-800/40 backdrop-blur-sm border border-neutral-600/40 rounded-full hover:bg-neutral-700/50 hover:scale-105 shadow-lg drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)] cursor-pointer"
                              >
                                {t("hero.view_product")}
                              </button>
                              <Link href="/shop/products" className="w-full">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="w-full px-6 py-3 text-sm md:text-base font-semibold text-neutral-300 transition-all duration-300 bg-transparent border border-neutral-600/50 rounded-full hover:bg-neutral-800/30 hover:scale-105 shadow-lg drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)] cursor-pointer"
                                >
                                  {t("hero.shop_all")}
                                </button>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Active Item Glow Effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-3xl pointer-events-none">
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neutral-500/10 via-transparent to-neutral-500/10 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {items.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    startAutoplay();
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-2 bg-neutral-400 shadow-lg shadow-neutral-500/20 cursor-pointer"
                      : "w-2 h-2 bg-neutral-600 hover:bg-neutral-500 hover:scale-110 cursor-pointer"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Hero;
