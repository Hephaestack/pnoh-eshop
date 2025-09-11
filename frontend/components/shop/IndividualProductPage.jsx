"use client";

import React from "react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useCart } from "../../app/cart-context";
import { IndividualProductSkeleton } from "@/components/skeletons/IndividualProductSkeleton";
import { motion, AnimatePresence } from "framer-motion";

function IndividualProductPage({ params, category, initialProduct = null }) {
  const router = useRouter();
  const [enlarged, setEnlarged] = useState(false);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Normalize initialProduct (server may return different field names like image_url / big_image_url)
  const normalizeProduct = (p) => {
    if (!p) return null;
    // If already normalized, return as is
    if (p.images && Array.isArray(p.images)) return p;

    const toArray = (v) => {
      if (!v) return null;
      if (Array.isArray(v)) return v;
      if (typeof v === 'string' && v.length) return [v];
      return null;
    };

    const rawSmall = toArray(p.image_url) || toArray(p.images);
    const smallImages = rawSmall && rawSmall.length > 0
      ? rawSmall.map((url) => (typeof url === 'string' ? url.replace('dl=0', 'raw=1') : url))
      : ["/placeholder-product.jpg"];

    const rawBig = toArray(p.big_image_url) || toArray(p.big_images);
    const bigImages = rawBig && rawBig.length > 0
      ? rawBig.map((url) => (typeof url === 'string' ? url.replace('dl=0', 'raw=1') : url))
      : null;

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      sub_category: p.sub_category,
      images: smallImages,
      big_images: bigImages,
    };
  };

  const [productData, setProductData] = useState(() => normalizeProduct(initialProduct));
  const [notFound, setNotFound] = useState(false);
  const [backUrl, setBackUrl] = useState(`/shop/${category}`);
  const requestIdRef = React.useRef(0);
  const loadingStartRef = React.useRef(0);
  const imageLoadedRef = React.useRef(false);
  const SKELETON_MIN_MS = 300;
  const SKELETON_SHOW_DELAY_MS = 80;
  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimerRef = React.useRef(null);

  const { addToCart, isAddingToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [added, setAdded] = useState(false);

  const { t } = useTranslation();

  const checkHideSkeleton = () => {
    const elapsed = Date.now() - loadingStartRef.current;
    if (imageLoadedRef.current && elapsed >= SKELETON_MIN_MS) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("page-ready"));
        });
      });
    }
  }, [isLoading]);

  const hideTimerRef = React.useRef(null);

  const handleAddToCart = async () => {
    if (!productData || isAddingToCart) return;
    setAdding(true);
    setAdded(true);

    try {
      await addToCart(productData.id, 1);
      hideTimerRef.current = setTimeout(() => setAdded(false), 600);
    } catch (err) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setAdded(false);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!productData) return;
    setBuyingNow(true);

    try {
      await addToCart(productData.id, 1);
      router.push('/cart');
    } catch (err) {
      // Error adding to cart, stay on current page
      console.error('Error adding to cart:', err);
    } finally {
      setBuyingNow(false);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Determine back URL based on referrer and navigation history
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (typeof window !== "undefined") {
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;
      const previousPath = sessionStorage.getItem("previousPath");

      let detectedPath = null;

      if (previousPath) {
        detectedPath = previousPath;
      } else if (referrer && referrer.startsWith(currentOrigin)) {
        detectedPath = referrer.replace(currentOrigin, "");
      }

      if (detectedPath) {
        if (
          detectedPath === "/shop/products" ||
          detectedPath.startsWith("/shop/products?") ||
          detectedPath.startsWith("/shop/products#")
        ) {
          setBackUrl("/shop/products");
        } else if (
          (detectedPath === `/shop/${category}` ||
            detectedPath.startsWith(`/shop/${category}?`)) &&
          !detectedPath.includes("[id]")
        ) {
          setBackUrl(`/shop/${category}`);
        } else if (detectedPath.includes("/shop/")) {
          setBackUrl(`/shop/${category}`);
        } else {
          setBackUrl(`/shop/${category}`);
        }
      } else {
        setBackUrl(`/shop/${category}`);
      }
    }
  }, [category]);

  // Fetch product from API
  useEffect(() => {
    if (initialProduct) {
      // product already provided from server - mark as not loading
      setIsLoading(false);
      imageLoadedRef.current = true;
      return;
    }

    const controller = new AbortController();
    const fetchProduct = async () => {
      const reqId = ++requestIdRef.current;
      try {
        setIsLoading(true);
        setShowSkeleton(false);
        if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
        skeletonTimerRef.current = setTimeout(
          () => setShowSkeleton(true),
          SKELETON_SHOW_DELAY_MS
        );
        loadingStartRef.current = Date.now();
        imageLoadedRef.current = false;
        setNotFound(false);
        setProductData(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/products/${params?.id}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (reqId !== requestIdRef.current) return;

        if (response.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

  const data = await response.json();
        if (reqId !== requestIdRef.current) return;
        
        if (!data) {
          throw new Error('No data received from API');
        }
        
        // Map small and big image URLs (backend may provide big_img_url)
        const smallImages = (data.image_url && Array.isArray(data.image_url) && data.image_url.length > 0)
          ? data.image_url.map((url) => url.replace("dl=0", "raw=1"))
          : ["/placeholder-product.jpg"];

        const bigImages = (data.big_image_url && Array.isArray(data.big_image_url) && data.big_image_url.length > 0)
          ? data.big_image_url.map((url) => url.replace("dl=0", "raw=1"))
          : null; // keep null so we can fallback to smallImages when needed

  const mapped = {
          id: data.id,
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          sub_category: data.sub_category,
          images: smallImages,
          big_images: bigImages,
        };
        
        // Validate that we have the minimum required data
        if (!mapped.id || !mapped.name || !mapped.images) {
          throw new Error('Invalid product data received from API');
        }
        
        setProductData(mapped);

        // Preload first image
        try {
          if (mapped && mapped.images && mapped.images.length > 0) {
            const imgLoader = new Image();
            imgLoader.onload = () => {
              if (reqId !== requestIdRef.current) return;
              imageLoadedRef.current = true;
              checkHideSkeleton();
            };
            imgLoader.onerror = () => {
              if (reqId !== requestIdRef.current) return;
              imageLoadedRef.current = true;
              checkHideSkeleton();
            };
            imgLoader.src = mapped.images[0];
          } else {
            imageLoadedRef.current = true;
            checkHideSkeleton();
          }
        } catch (e) {
          imageLoadedRef.current = true;
          checkHideSkeleton();
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        // suppressed product fetch error
      } finally {
        const elapsed = Date.now() - loadingStartRef.current;
        const remaining = Math.max(0, SKELETON_MIN_MS - elapsed);
        if (remaining > 0) setTimeout(checkHideSkeleton, remaining);
        else checkHideSkeleton();
      }
    };

    if (params?.id) {
      fetchProduct();
    }

    return () => {
      controller.abort();
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
        skeletonTimerRef.current = null;
      }
    };
  }, [params?.id]);

  // Render JSON-LD product schema if we have product data available (this will be server-rendered when initialProduct provided)
  const productSchema = productData
    ? {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: productData.name,
        description: productData.description,
        image: productData.images,
        sku: productData.id?.toString(),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: productData.price?.toString() || undefined,
          availability: 'https://schema.org/InStock',
        },
      }
    : null;

  const handleImageNavigation = (direction) => {
    if (!productData?.images) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === productData.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? productData.images.length - 1 : prev - 1
      );
    }
  };

  const handleEnlargedImageNavigation = (direction) => {
    if (!productData?.images) return;
    
    if (direction === 'next') {
      setEnlargedImageIndex((prev) => 
        prev === productData.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setEnlargedImageIndex((prev) => 
        prev === 0 ? productData.images.length - 1 : prev - 1
      );
    }
  };

  const openEnlarged = (index = currentImageIndex) => {
    setEnlargedImageIndex(index);
    setEnlarged(true);
  };

  // Touch/swipe support for enlarged modal
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const MIN_SWIPE_DISTANCE = 40; // px

  const handleTouchStart = (e) => {
    touchEndXRef.current = null;
    if (e.touches && e.touches.length > 0) touchStartXRef.current = e.touches[0].clientX;
    else touchStartXRef.current = e.clientX;
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) touchEndXRef.current = e.touches[0].clientX;
    else touchEndXRef.current = e.clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current == null || touchEndXRef.current == null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return;
    if (distance > 0) {
      // swiped left -> next
      handleEnlargedImageNavigation('next');
    } else {
      // swiped right -> prev
      handleEnlargedImageNavigation('prev');
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Skeleton loader
  if (isLoading) {
    if (!showSkeleton) {
      return (
        <main className="container max-w-4xl min-h-screen px-4 py-6 mx-auto md:py-8">
          <div className="invisible w-full" style={{ minHeight: "640px" }} />
        </main>
      );
    }

    return <IndividualProductSkeleton />;
  }

  if (notFound) {
    return (
      <main className="container max-w-4xl min-h-screen px-4 py-6 mx-auto md:py-8">
        <Link
          href="/shop/products"
          className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 md:mb-8 inline-block"
        >
          {t("back_to_collection")}
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-[#f8f8f8] text-xl mb-2">
            {t("product_not_found", "Product not found")}
          </p>
          <p className="text-[#bcbcbc]">
            {t("product_not_found_desc", "The product you're looking for doesn't exist.")}
          </p>
        </div>
      </main>
    );
  }

  if (!productData) {
    return (
      <main className="container max-w-4xl min-h-screen px-4 py-6 mx-auto md:py-8">
        <Link
          href="/shop/products"
          className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 md:mb-8 inline-block"
        >
          {t("back_to_collection")}
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-[#f8f8f8] text-xl mb-2">
            {t("error_loading_product", "Error loading product")}
          </p>
          <p className="text-[#bcbcbc] mb-4">
            {t("try_again_or_contact", "Please try again or contact support.")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-black transition-colors bg-white rounded-md hover:bg-gray-100"
          >
            {t("retry", "Retry")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-5xl min-h-screen px-6 py-12 mx-auto md:py-16">
      {productSchema && (
        <script
          type="application/ld+json"
          // Danger: next.js escapes by default so we stringify here
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {/* Back navigation with enhanced styling */}
      <div className="mb-8 md:mb-12">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-3 text-[#bcbcbc] hover:text-[#f8f8f8] text-sm font-medium group transition-all duration-300 hover:gap-4"
        >
          <div className="flex items-center justify-center w-8 h-8 transition-all duration-300 border rounded-full bg-white/5 border-white/10 backdrop-blur-sm group-hover:bg-white/10">
            <svg 
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="tracking-wide">
            {backUrl.includes("/products") ? t("back_to_all_products") : t("back_to_collection")}
          </span>
        </Link>
      </div>

      {/* Main product content with enhanced layout */}
  <div className="grid gap-12 mb-20 lg:grid-cols-5 lg:gap-16 md:mb-24">
        {/* Image gallery - takes 3 columns */}
  <div className="space-y-6 lg:col-span-3 md:space-y-8">
          {/* Main image with enhanced container */}
          <div className="relative group">
            <div 
              className="relative max-w-md mx-auto overflow-hidden shadow-xl aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 cursor-zoom-in ring-1 ring-black/5 lg:max-w-none lg:mx-0"
              onClick={() => openEnlarged(currentImageIndex)}
            >
              <img
                src={productData.images[currentImageIndex]}
                alt={`${productData.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
              />
              
              {/* Enhanced navigation arrows */}
              {productData.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation('prev');
                    }}
                    className="absolute flex items-center justify-center text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 left-2 top-1/2 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm group-hover:opacity-100 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation('next');
                    }}
                    className="absolute flex items-center justify-center text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 right-2 top-1/2 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm group-hover:opacity-100 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Enhanced image counter */}
              {productData.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {productData.images.length}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced thumbnail gallery */}
            {productData.images.length > 1 && (
            <div className="flex justify-center gap-4 pb-4 overflow-x-auto lg:justify-start">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-18 md:h-18 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    index === currentImageIndex 
                      ? 'border-white shadow-lg ring-2 ring-white/20' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} - Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Shipping info moved closer to images with a smooth separator */}
          <div className="mt-8 lg:mt-10">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <div className="rounded-xl p-6 md:p-8 text-[#bcbcbc]">
              <h3 className="text-sm font-medium text-[#f8f8f8] uppercase tracking-widest mb-3">{t("shipping_title", "Shipping Information")}</h3>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex items-start gap-3 text-left"><span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span><span>{t("shipping_boxnow", "BoxNow delivery available")}</span></li>
                <li className="flex items-start gap-3 text-left"><span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span><span>{t("shipping_geniki", "Geniki Taxydromiki delivery")}</span></li>
                <li className="flex items-start gap-3 text-left"><span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span><span>{t("shipping_free", "Free shipping on orders over €50")}</span></li>
                <li className="flex items-start gap-3 text-left"><span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span><span>{t("shipping_time", "Delivery within 2-5 business days")}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced product details - takes 2 columns */}
  <div className="px-3 space-y-10 text-center lg:col-span-2 lg:text-left lg:px-0">
          {/* Product header with refined typography */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#f8f8f8] tracking-tight leading-tight">
                {productData.name}
              </h1>
              <p className="text-[#bcbcbc] text-lg font-light tracking-wide uppercase">
                {productData.category}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 lg:justify-start">
              <div className="text-3xl md:text-4xl font-light text-[#f8f8f8] tracking-tight">
                €{productData.price}
              </div>
            
             
            </div>
          </div>

          {/* Description with enhanced styling */}
          <div className="space-y-6">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div>
              <h3 className="text-sm font-medium text-[#bcbcbc] uppercase tracking-widest mb-3">{t("description", "Description")}</h3>
              <p className="text-[#e5e5e5] leading-relaxed text-base md:text-lg font-light whitespace-pre-line">
                {productData.description}
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Enhanced add to cart section */}
          <div className="pt-6 space-y-6">
            <div className="flex flex-col max-w-md gap-6 mx-auto sm:flex-row lg:max-w-none lg:mx-0">
              <button
                className={`group relative overflow-hidden px-8 py-4 text-base font-medium transition-all duration-300 rounded-xl ${
                  added 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25" 
                    : isAddingToCart
                    ? "bg-red-500 text-white cursor-not-allowed shadow-lg pointer-events-none"
                    : "bg-white text-black hover:bg-gray-50 shadow-lg shadow-white/10 hover:shadow-white/20"
                }`}
                onClick={handleAddToCart}
                disabled={adding || isAddingToCart}
                style={isAddingToCart ? { pointerEvents: 'none' } : {}}
              >
                <span className="relative z-10">
                  {added
                    ? "✓ " + t("added", "Added!")
                    : adding
                    ? t("adding", "Adding...")
                    : isAddingToCart
                    ? t("please_wait", "Please wait...")
                    : t("add_to_cart", "Add to Cart")}
                </span>
                {!added && !adding && !isAddingToCart && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
              </button>

              <button 
                className="relative px-8 py-4 overflow-hidden text-base font-medium text-white transition-all duration-300 bg-transparent border-2 group border-white/20 hover:border-white/40 hover:bg-white/5 rounded-xl backdrop-blur-sm"
                onClick={handleBuyNow}
                disabled={buyingNow}
              >
                <span className="relative z-10">
                  {buyingNow ? t("buying", "Buying...") : t("buy_now", "Buy Now")}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional information sections */}
      <div className="max-w-2xl px-2 mx-auto space-y-8 md:space-y-8 md:max-w-none md:px-0">
        <section className="space-y-4 text-center md:space-y-4 md:text-left">
          <h2 className="text-xl md:text-xl font-semibold text-[#f8f8f8]">
            {t("returns_title", "Returns & Exchange")}
          </h2>
          <p className="text-[#e5e5e5] text-sm md:text-sm">
            {t("returns_notice", "Return shipping costs may apply")}
          </p>
        </section>
      </div>

      {/* Enlarged image modal */}
      <AnimatePresence>
        {enlarged && (
          <motion.div
            key="enlarged-modal"
            className="fixed inset-0 flex items-center justify-center bg-black/80"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlarged(false)}
          >
            <motion.div
              className="relative w-full h-full p-6 md:p-8 flex items-center justify-center"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left control */}
              {productData.images.length > 1 && (
                <button
                  onClick={() => handleEnlargedImageNavigation('prev')}
                  className="hidden sm:flex absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white rounded-full bg-black/50 hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Animated image container */}
              <div
                className="relative max-w-[80vw] max-h-[80vh] md:max-w-[70vw] lg:max-w-[60vw] w-full flex items-center justify-center"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={productData.big_images?.[enlargedImageIndex] || productData.images[enlargedImageIndex]}
                    src={productData.big_images?.[enlargedImageIndex] || productData.images[enlargedImageIndex]}
                    alt={`${productData.name} - Enlarged view`}
                    className="object-contain max-w-full max-h-full rounded-md"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </AnimatePresence>

                {/* Close button outside the image but visually near it */}
                <button
                  className="absolute z-30 -top-12 right-0 w-10 h-10 text-white transition-colors hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnlarged(false);
                  }}
                  aria-label={t("close")}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Counter below image */}
                {productData.images.length > 1 && (
                  <div className="absolute px-4 py-2 text-white -translate-x-1/2 rounded-full bottom-[-3rem] left-1/2 bg-black/50">
                    {enlargedImageIndex + 1} / {productData.images.length}
                  </div>
                )}
              </div>

              {/* Right control */}
              {productData.images.length > 1 && (
                <button
                  onClick={() => handleEnlargedImageNavigation('next')}
                  className="hidden sm:flex absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white rounded-full bg-black/50 hover:bg-black/70"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default IndividualProductPage;
