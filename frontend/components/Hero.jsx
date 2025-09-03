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
            
            // Preload first few images for better performance
            finalItems.slice(0, 3).forEach((item, index) => {
              if (item.img && !item.img.includes('/images/test2.jpg')) {
                const preloadImg = document.createElement('img');
                preloadImg.src = item.img;
                console.log(`Preloading image ${index + 1}:`, item.img);
              }
            });
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
    // Pause autoplay during touch interaction
    clearInterval(intervalRef.current);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current !== null) {
      touchEndX.current = e.touches[0].clientX;
      // Don't call preventDefault - React events are passive
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-black overflow-hidden">
      {/* Multi-layer Background with Depth */}
      <div className="absolute inset-0">
        {/* Primary depth layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(64,64,64,0.15),_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(96,96,96,0.08),_transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(32,32,32,0.2),_transparent_50%)]"></div>
        
        {/* Secondary depth layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(64,64,64,0.08),_transparent_50%)] opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(96,96,96,0.03),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(64,64,64,0.04),_transparent_50%)]"></div>
        
        {/* Subtle noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Bottom blend gradient to match next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#18181b] via-[#18181b]/80 to-transparent z-10"></div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center bg-neutral-900/40 backdrop-blur-lg rounded-2xl border border-neutral-700/30">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-neutral-500/40 border-t-neutral-400 rounded-full animate-spin"></div>
            <div className="text-lg text-neutral-300">{t("hero.loading_products")}</div>
          </div>
        </div>
      )}

      {/* No Products State */}
      {!loading && items.length === 0 && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md p-8 text-center bg-neutral-900/40 backdrop-blur-lg rounded-2xl border border-neutral-700/30">
            <h2 className="mb-4 text-2xl font-light text-neutral-200">{t("hero.no_products")}</h2>
            <p className="mb-6 text-neutral-400">{t("hero.no_products_desc")}</p>
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
      {!loading && items.length > 0 && (
        <div 
          className="relative flex items-center min-h-screen p-4 md:p-8 touch-pan-y"
          style={{ touchAction: 'pan-y' }}
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
              transition={{ delay: 2, duration: 1, repeat: 2, repeatType: "reverse" }}
              className="flex items-center text-sm text-neutral-400 bg-neutral-900/30 backdrop-blur-lg px-4 py-2 rounded-full border border-neutral-700/30"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              {t("hero.swipe_hint")}
            </motion.div>
          </div>

          {/* Navigation Arrows - Hidden on Mobile */}
          <button
            onClick={handlePrev}
            className="absolute z-30 left-4 md:left-8 p-3 md:p-4 text-neutral-300 transition-all duration-300 bg-neutral-900/30 backdrop-blur-lg border border-neutral-700/30 rounded-full hover:bg-neutral-800/50 hover:scale-110 group shadow-xl hidden md:flex items-center justify-center"
            aria-label="Previous product"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute z-30 right-4 md:right-8 p-3 md:p-4 text-neutral-300 transition-all duration-300 bg-neutral-900/30 backdrop-blur-lg border border-neutral-700/30 rounded-full hover:bg-neutral-800/50 hover:scale-110 group shadow-xl hidden md:flex items-center justify-center"
            aria-label="Next product"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Horizontal Carousel */}
          <div className="relative w-full max-w-7xl mx-auto px-4 md:px-0">
            <div className="flex items-center justify-center md:space-x-8">
              {items.map((item, index) => {
                const isActive = index === currentIndex;
                const isPrev = index === (currentIndex - 1 + items.length) % items.length;
                const isNext = index === (currentIndex + 1) % items.length;
                const isVisible = isActive || isPrev || isNext;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={item.id}
                    className={`relative transition-all duration-700 ease-out ${
                      isActive 
                        ? 'scale-100 z-20 cursor-pointer flex justify-center' 
                        : 'scale-75 md:scale-85 z-10 hover:scale-80 md:hover:scale-90 hidden md:block md:cursor-pointer'
                    }`}
                    onClick={() => {
                      if (isActive) {
                        handleImageClick();
                      } else {
                        // Only allow navigation on desktop (this will only execute on desktop due to hidden class on mobile)
                        setCurrentIndex(index);
                        startAutoplay();
                      }
                    }}
                    initial={false}
                    animate={{
                      filter: isActive ? 'blur(0px)' : 'blur(2px)',
                      opacity: isActive ? 1 : 0.6,
                      y: isActive ? 0 : 20,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    {/* Glass Card Container */}
                    <div className={`relative bg-neutral-900/20 backdrop-blur-lg border border-neutral-700/30 rounded-3xl overflow-hidden shadow-2xl ${
                      isActive ? 'shadow-neutral-500/10' : 'shadow-black/30'
                    }`}>
                      {/* Image Container */}
                      <div className="relative w-80 sm:w-96 md:w-80 lg:w-[440px] xl:w-[480px] h-96 sm:h-[450px] md:h-96 lg:h-[520px] xl:h-[560px] mx-auto">
                        <Image
                          src={item.img || "/images/test2.jpg"}
                          alt={item.title || "Product"}
                          fill
                          sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 320px, (max-width: 1280px) 440px, 480px"
                          quality={100}
                          className="object-cover"
                          priority={true}
                          loading="eager"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDzLpPQ8t0M5/b7OFnT6t7C4m9BJ2vTw1NJkdNhOwh0u/OImLEggZDEyUWLpV2I0m+LWi1j3hVxOBXhQz/LjKEpz9lCZjH0P6+s4+zE+1s5a1uFQ=="
                          onError={(e) => {
                            console.log("Image failed to load:", item.img);
                            e.currentTarget.src = "/images/test2.jpg";
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>

                      {/* Product Info - Only show on active item */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
                          >
                            <h1 className="mb-3 text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-100 leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] shadow-black">
                              {item.title}
                            </h1>
                            <p className="mb-6 text-xl md:text-2xl lg:text-3xl font-bold text-neutral-200 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] shadow-black">
                              ${item.price}
                            </p>
                            <div className="flex flex-col w-full space-y-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageClick();
                                }}
                                className="w-full px-6 py-3 text-sm md:text-base font-semibold text-neutral-200 transition-all duration-300 bg-neutral-800/40 backdrop-blur-sm border border-neutral-600/40 rounded-full hover:bg-neutral-700/50 hover:scale-105 shadow-lg drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]"
                              >
                                {t("hero.view_product")}
                              </button>
                              <Link href="/shop/products" className="w-full">
                                <button className="w-full px-6 py-3 text-sm md:text-base font-semibold text-neutral-300 transition-all duration-300 bg-transparent border border-neutral-600/50 rounded-full hover:bg-neutral-800/30 hover:scale-105 shadow-lg drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">
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
            <div className="flex justify-center mt-8 space-x-3">
              {items.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    startAutoplay();
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? 'w-12 h-3 bg-neutral-400 shadow-lg shadow-neutral-500/20' 
                      : 'w-3 h-3 bg-neutral-600 hover:bg-neutral-500 hover:scale-110'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
