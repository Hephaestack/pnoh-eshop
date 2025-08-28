"use client";

import React from "react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useCart } from "../../app/cart-context";

function IndividualProductPage({ params, category }) {
  const routeParams = React.use(params);
  const router = useRouter();
  const [enlarged, setEnlarged] = useState(false);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [backUrl, setBackUrl] = useState(`/shop/${category}`);
  const requestIdRef = React.useRef(0);
  const loadingStartRef = React.useRef(0);
  const imageLoadedRef = React.useRef(false);
  const SKELETON_MIN_MS = 300;
  const SKELETON_SHOW_DELAY_MS = 80;
  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimerRef = React.useRef(null);

  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
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
    if (!productData) return;
    setAdding(true);
    setAdded(true);

    try {
      await addToCart(productData.id, 1);
      hideTimerRef.current = setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setAdded(false);
      console.error("Error adding to cart:", err);
    } finally {
      setAdding(false);
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
        const response = await fetch(`${apiUrl}/products/${routeParams?.id}`, {
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
        
        const mapped = {
          id: data.id,
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          sub_category: data.sub_category,
          images: data.image_url && data.image_url.length > 0
            ? data.image_url.map((url) => url.replace("dl=0", "raw=1"))
            : ["/placeholder-product.jpg"],
        };
        setProductData(mapped);

        // Preload first image
        try {
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
        } catch (e) {
          imageLoadedRef.current = true;
          checkHideSkeleton();
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching product:", error);
      } finally {
        const elapsed = Date.now() - loadingStartRef.current;
        const remaining = Math.max(0, SKELETON_MIN_MS - elapsed);
        if (remaining > 0) setTimeout(checkHideSkeleton, remaining);
        else checkHideSkeleton();
      }
    };

    if (routeParams?.id) {
      fetchProduct();
    }

    return () => {
      controller.abort();
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
        skeletonTimerRef.current = null;
      }
    };
  }, [routeParams?.id]);

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

  // Skeleton loader
  if (isLoading) {
    if (!showSkeleton) {
      return (
        <main className="container max-w-4xl min-h-screen px-4 py-6 mx-auto md:py-8">
          <div className="invisible w-full" style={{ minHeight: "640px" }} />
        </main>
      );
    }

    return (
      <main className="container max-w-4xl min-h-screen px-4 py-6 mx-auto md:py-8" aria-hidden>
        <div className="animate-pulse">
          <div className="w-32 h-4 mb-6 bg-gray-700 rounded md:mb-8" />
          
          <div className="grid gap-6 mb-12 md:grid-cols-2 md:gap-8 lg:gap-12 md:mb-16">
            {/* Image skeleton */}
            <div className="space-y-3 md:space-y-4">
              <div className="max-w-sm mx-auto bg-gray-700 rounded-lg aspect-square md:max-w-none md:mx-0" />
              <div className="flex justify-center gap-2 md:justify-start">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-md w-14 h-14 md:w-16 md:h-16" />
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="px-2 space-y-6 text-center md:space-y-6 md:text-left md:px-0">
              <div className="w-3/4 h-8 mx-auto bg-gray-700 rounded md:mx-0" />
              <div className="w-1/2 h-5 mx-auto bg-gray-700 rounded md:mx-0" />
              <div className="w-1/3 h-6 mx-auto bg-gray-700 rounded md:mx-0" />
              <div className="space-y-3">
                <div className="w-full h-4 bg-gray-700 rounded" />
                <div className="w-5/6 h-4 mx-auto bg-gray-700 rounded md:mx-0" />
                <div className="w-4/6 h-4 mx-auto bg-gray-700 rounded md:mx-0" />
              </div>
              <div className="flex flex-col max-w-sm gap-4 pt-6 mx-auto sm:flex-row md:gap-4 md:max-w-none md:mx-0">
                <div className="flex-1 h-12 bg-gray-700 rounded md:h-12" />
                <div className="flex-1 h-12 bg-gray-700 rounded md:h-12" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
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
    <main className="container max-w-5xl min-h-screen px-4 py-8 mx-auto md:py-12">
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
      <div className="grid gap-8 mb-16 lg:grid-cols-5 lg:gap-12 md:mb-20">
        {/* Image gallery - takes 3 columns */}
        <div className="space-y-4 lg:col-span-3 md:space-y-6">
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
                    className="absolute flex items-center justify-center text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 left-4 top-1/2 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm group-hover:opacity-100 hover:scale-110"
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
                    className="absolute flex items-center justify-center text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 right-4 top-1/2 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm group-hover:opacity-100 hover:scale-110"
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
            <div className="flex justify-center gap-3 pb-2 overflow-x-auto lg:justify-start">
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
        </div>

        {/* Enhanced product details - takes 2 columns */}
        <div className="px-2 space-y-8 text-center lg:col-span-2 lg:text-left lg:px-0">
          {/* Product header with refined typography */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#f8f8f8] tracking-tight leading-tight">
                {productData.name}
              </h1>
              <p className="text-[#bcbcbc] text-lg font-light tracking-wide uppercase">
                {productData.category}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <div className="text-3xl md:text-4xl font-light text-[#f8f8f8] tracking-tight">
                €{productData.price}
              </div>
            
             
            </div>
          </div>

          {/* Description with enhanced styling */}
          <div className="space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div>
              <h3 className="text-sm font-medium text-[#bcbcbc] uppercase tracking-widest mb-3">{t("description", "Description")}</h3>
              <p className="text-[#e5e5e5] leading-relaxed text-base md:text-lg font-light">
                {productData.description}
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Enhanced add to cart section */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row lg:max-w-none lg:mx-0">
              <button
                className={`group relative overflow-hidden px-8 py-4 text-base font-medium transition-all duration-300 rounded-xl ${
                  added 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25" 
                    : "bg-white text-black hover:bg-gray-50 shadow-lg shadow-white/10 hover:shadow-white/20"
                }`}
                onClick={handleAddToCart}
                disabled={adding}
              >
                <span className="relative z-10">
                  {added
                    ? "✓ " + t("added", "Added!")
                    : adding
                    ? t("adding", "Adding...")
                    : t("add_to_cart", "Add to Cart")}
                </span>
                {!added && !adding && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
              </button>
              
              <button className="relative px-8 py-4 overflow-hidden text-base font-medium text-white transition-all duration-300 bg-transparent border-2 group border-white/20 hover:border-white/40 hover:bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="relative z-10">{t("buy_now", "Buy Now")}</span>
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
            {t("shipping_title", "Shipping Information")}
          </h2>
          <div className="space-y-3 text-[#bcbcbc] text-base md:text-base max-w-md mx-auto md:max-w-none md:mx-0">
            <div className="flex items-start gap-3 text-left">
              <span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span>
              <span>{t("shipping_boxnow", "BoxNow delivery available")}</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span>
              <span>{t("shipping_geniki", "Geniki Taxydromiki delivery")}</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span>
              <span>{t("shipping_free", "Free shipping on orders over €50")}</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <span className="w-1.5 h-1.5 bg-[#bcbcbc] rounded-full mt-2.5 flex-shrink-0"></span>
              <span>{t("shipping_time", "Delivery within 2-5 business days")}</span>
            </div>
          </div>
          <p className="text-[#e5e5e5] text-sm md:text-sm pt-2">
            {t("shipping_notice", "Shipping costs calculated at checkout")}
          </p>
        </section>

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
      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setEnlarged(false)}
        >
          <div className="relative flex items-center justify-center w-full h-full p-4">
            <img
              src={productData.images[enlargedImageIndex]}
              alt={`${productData.name} - Enlarged view`}
              className="object-contain max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation arrows for enlarged view */}
            {productData.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnlargedImageNavigation('prev');
                  }}
                  className="absolute flex items-center justify-center w-12 h-12 text-white transition-all -translate-y-1/2 rounded-full left-8 top-1/2 bg-black/50 hover:bg-black/70"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnlargedImageNavigation('next');
                  }}
                  className="absolute flex items-center justify-center w-12 h-12 text-white transition-all -translate-y-1/2 rounded-full right-8 top-1/2 bg-black/50 hover:bg-black/70"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Close button */}
            <button
              className="absolute w-12 h-12 text-white transition-colors top-8 right-8 hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setEnlarged(false);
              }}
              aria-label={t("close")}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image counter for enlarged view */}
            {productData.images.length > 1 && (
              <div className="absolute px-4 py-2 text-white -translate-x-1/2 rounded-full bottom-8 left-1/2 bg-black/50">
                {enlargedImageIndex + 1} / {productData.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default IndividualProductPage;
