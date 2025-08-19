"use client";

import React from "react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
// Page transition fade-in used when content mounts
const _fadeStyle = `@keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }`;
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "../../../cart-context";

function RingsPageInner({ params }) {
  const routeParams = React.use(params);
  const router = useRouter();
  const [enlarged, setEnlarged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [backUrl, setBackUrl] = useState("/shop/rings"); // Default fallback
  const requestIdRef = React.useRef(0);
  const loadingStartRef = React.useRef(0);
  const imageLoadedRef = React.useRef(false);
  const SKELETON_MIN_MS = 300;
  const SKELETON_SHOW_DELAY_MS = 80;
  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimerRef = React.useRef(null);

  const checkHideSkeleton = () => {
    // only hide skeleton when image loaded and minimum time elapsed
    const elapsed = Date.now() - loadingStartRef.current;
    if (imageLoadedRef.current && elapsed >= SKELETON_MIN_MS) {
      setIsLoading(false);
    }
  };
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { t } = useTranslation();

  // Signal to the root layout that this page is ready (used to remove the universal loader)
  useEffect(() => {
    if (!isLoading) {
      // wait two animation frames to ensure DOM has painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("page-ready"));
        });
      });
    }
  }, [isLoading]);

  const handleAddToCart = async () => {
    if (!productData) return;
    setAdding(true);
    try {
      await addToCart(productData.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  // Determine back URL based on referrer and navigation history
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (typeof window !== "undefined") {
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;

      console.log("Rings - Full referrer URL:", referrer); // Debug log
      console.log("Rings - Current origin:", currentOrigin); // Debug log

      // First try to get from session storage (more reliable for SPA navigation)
      const previousPath = sessionStorage.getItem("previousPath");
      console.log("Rings - Previous path from storage:", previousPath); // Debug log

      let detectedPath = null;

      // Check session storage first (for SPA navigation)
      if (previousPath) {
        detectedPath = previousPath;
      }
      // Fall back to document.referrer (for direct navigation/refresh)
      else if (referrer && referrer.startsWith(currentOrigin)) {
        detectedPath = referrer.replace(currentOrigin, "");
      }

      console.log("Rings - Detected path:", detectedPath); // Debug log

      if (detectedPath) {
        // More precise matching for all products page
        if (
          detectedPath === "/shop/products" ||
          detectedPath.startsWith("/shop/products?") ||
          detectedPath.startsWith("/shop/products#")
        ) {
          console.log(
            "Rings - ✅ DETECTED ALL PRODUCTS PAGE - Setting back to /shop/products"
          ); // Debug log
          setBackUrl("/shop/products");
        }
        // If coming from rings category page
        else if (
          (detectedPath === "/shop/rings" ||
            detectedPath.startsWith("/shop/rings?")) &&
          !detectedPath.includes("[id]")
        ) {
          console.log(
            "Rings - ✅ DETECTED RINGS CATEGORY - Setting back to /shop/rings"
          ); // Debug log
          setBackUrl("/shop/rings");
        }
        // If coming from other category pages, still go to rings
        else if (detectedPath.includes("/shop/")) {
          console.log(
            "Rings - ✅ DETECTED OTHER SHOP PAGE - Setting back to /shop/rings",
            detectedPath
          ); // Debug log
          setBackUrl("/shop/rings");
        }
        // Default fallback
        else {
          console.log(
            "Rings - ⚠️ FALLBACK - Using default /shop/rings for path:",
            detectedPath
          ); // Debug log
          setBackUrl("/shop/rings");
        }
      } else {
        console.log(
          "Rings - ❌ NO VALID PATH DETECTED - Using default /shop/rings"
        ); // Debug log
        setBackUrl("/shop/rings");
      }
    }
  }, []);

  // Fetch product from API
  useEffect(() => {
    const controller = new AbortController();
    const fetchProduct = async () => {
      const reqId = ++requestIdRef.current; // capture this fetch id
      try {
        // clear stale data and reset notFound when starting a new fetch
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

        // ignore if this response belongs to an earlier request
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
          image:
            data.image_url && data.image_url.length > 0
              ? data.image_url[0].replace("dl=0", "raw=1")
              : "/placeholder-product.jpg",
          images: data.image_url
            ? data.image_url.map((url) => url.replace("dl=0", "raw=1"))
            : [],
        };
        setProductData(mapped);

        // Preload the main image (so skeleton can hide once image is ready)
        try {
          const imgLoader = new Image();
          imgLoader.onload = () => {
            if (reqId !== requestIdRef.current) return;
            imageLoadedRef.current = true;
            checkHideSkeleton();
          };
          imgLoader.onerror = () => {
            if (reqId !== requestIdRef.current) return;
            imageLoadedRef.current = true; // treat error as loaded
            checkHideSkeleton();
          };
          imgLoader.src = mapped.image;
        } catch (e) {
          imageLoadedRef.current = true;
          checkHideSkeleton();
        }
      } catch (error) {
        if (error.name === "AbortError") return; // ignore aborted fetch
        console.error("Error fetching product:", error);
      } finally {
        // ensure skeleton stays for minimum time; actual hiding occurs in checkHideSkeleton
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

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function animate() {
    // Lower lerp for more stickiness
    const lerp = (a, b, n) => a + (b - a) * n;
    current.current.tx = lerp(current.current.tx, target.current.tx, 0.1);
    current.current.ty = lerp(current.current.ty, target.current.ty, 0.1);
    current.current.rx = lerp(current.current.rx, target.current.rx, 0.1);
    current.current.ry = lerp(current.current.ry, target.current.ry, 0.1);
    // Clamp for more physical feel
    const tx = clamp(current.current.tx, -60, 60);
    const ty = clamp(current.current.ty, -60, 60);
    const rx = clamp(current.current.rx, -22, 22);
    const ry = clamp(current.current.ry, -22, 22);
    const img = imgRef.current;
    if (img) {
      img.style.transform = `translate(${tx}px, ${ty}px) rotateX(${-rx}deg) rotateY(${ry}deg) scale(1.10)`;
    }
    animationFrame.current = requestAnimationFrame(animate);
  }

  function handleMouseMove(e) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Strong, smooth pull: max 48px translate, max 18deg rotate
    target.current.tx = ((x - centerX) / centerX) * 48;
    target.current.ty = ((y - centerY) / centerY) * 48;
    target.current.rx = ((y - centerY) / centerY) * 18;
    target.current.ry = ((x - centerX) / centerX) * 18;
    if (!animationFrame.current) animate();
  }

  function handleMouseLeave() {
    // Add a slight delay before returning for a sticky feel
    setTimeout(() => {
      target.current = { tx: 0, ty: 0, rx: 0, ry: 0 };
    }, 80);
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    // Animate back to center
    const img = imgRef.current;
    if (!img) return;
    img.style.transition = "transform 0.7s cubic-bezier(.22,1,.36,1)";
    img.style.transform =
      "translate(0px,0px) rotateX(0deg) rotateY(0deg) scale(1)";
    setTimeout(() => {
      if (img) img.style.transition = "";
    }, 700);
    // Reset current for next hover
    current.current = { tx: 0, ty: 0, rx: 0, ry: 0 };
  }

  // while loading: wait briefly before showing the skeleton to avoid a flash.
  if (isLoading) {
    if (!showSkeleton) {
      // invisible placeholder preserves layout so footer doesn't jump
      return (
        <main className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left">
          <div className="invisible w-full" style={{ minHeight: "640px" }} />
        </main>
      );
    }

    return (
      <main
        className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left"
        aria-hidden
      >
        <div className="animate-pulse">
          {/* back link skeleton */}
          <div className="h-5 mx-auto mb-6 bg-gray-600 rounded w-28 md:mx-0" />

          <div className="flex flex-col items-center w-full gap-8 mb-10 md:flex-row md:items-start">
            {/* image skeleton */}
            <div className="flex items-center justify-center flex-shrink-0 w-full md:w-1/2">
              <div className="w-full h-64 max-w-xs bg-gray-600 rounded-md" />
            </div>

            {/* content skeleton */}
            <div className="flex flex-col items-center justify-center flex-1 w-full text-center md:items-start md:text-left">
              <div className="w-3/4 mb-3 bg-gray-600 rounded h-7" />
              <div className="w-1/2 h-5 mb-3 bg-gray-600 rounded" />
              <div className="w-full h-4 mb-2 bg-gray-600 rounded" />
              <div className="w-full h-4 mb-2 bg-gray-600 rounded" />
              <div className="w-32 h-8 mt-4 mb-3 bg-gray-600 rounded" />
              <div className="flex items-center gap-2">
                <div className="w-32 h-10 bg-gray-600 rounded" />
                <div className="w-32 h-10 bg-gray-600 rounded" />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="w-full h-4 bg-gray-600 rounded" />
            <div className="w-full h-4 bg-gray-600 rounded" />
            <div className="w-2/3 h-4 bg-gray-600 rounded" />
          </div>
        </div>
      </main>
    );
  }

  // show not-found only when we've finished loading and the API returned 404
  if (notFound) {
    return (
      <main className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left">
        <Link
          href="/products"
          className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 inline-block"
        >
          {t("back_to_collection")}``
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-[#f8f8f8] text-xl mb-2">
            {t("product_not_found", "Product not found")}
          </p>
          <p className="text-[#bcbcbc]">
            {t(
              "product_not_found_desc",
              "The product you're looking for doesn't exist."
            )}
          </p>
        </div>
      </main>
    );
  }

  // If we finished loading but productData is still null (non-404 error),
  // show a simple error state and a retry button instead of rendering the page
  // and causing a TypeError when trying to access productData fields.
  if (!productData) {
    return (
      <main className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left">
        <Link
          href="/products"
          className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 inline-block"
        >
          {t("back_to_collection")}
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-[#f8f8f8] text-xl mb-2">
            {t("error_loading_product", "Error loading product")}
          </p>
          <p className="text-[#bcbcbc] mb-4">
            {t("try_again_or_contact", "Please try again or contact support.")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-serif bg-transparent border rounded-md border-slate-300 text-slate-200"
          >
            {t("retry", "Retry")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left">
      <Link
        href={backUrl}
        className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 inline-block"
      >
        {backUrl.includes("/products")
          ? t("back_to_all_products")
          : t("back_to_collection")}
      </Link>
      <div className="flex flex-col items-center w-full gap-8 mb-10 md:flex-row md:items-start">
        <div
          className="flex items-center justify-center flex-shrink-0 w-full cursor-pointer md:w-1/2"
          onClick={() => setEnlarged(true)}
        >
          <div className="relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden backdrop-blur-md backdrop-saturate-150 w-full max-w-xs">
            <img
              src={productData.image}
              alt={productData.name}
              className="object-cover w-full h-full"
              style={{ cursor: "zoom-in" }}
              onLoad={() => {
                imageLoadedRef.current = true;
                checkHideSkeleton();
              }}
              onError={() => {
                imageLoadedRef.current = true; // treat error as loaded to avoid hanging skeleton
                checkHideSkeleton();
              }}
            />
          </div>
        </div>

        {/* Enlarged image overlay */}
        {enlarged && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setEnlarged(false)}
          >
            <div
              className="relative transition-all duration-500 ease-out scale-90 opacity-0 animate-zoomIn"
              style={{
                animation: "zoomIn 0.5s cubic-bezier(.22,1,.36,1) forwards",
              }}
            >
              <img
                src={productData.image}
                alt={productData.name}
                className="rounded-xl shadow-2xl object-contain max-h-[90vh] max-w-[95vw] transition-transform duration-500"
                style={{ cursor: "zoom-out" }}
                onLoad={() => {
                  imageLoadedRef.current = true;
                  checkHideSkeleton();
                }}
                onError={() => {
                  imageLoadedRef.current = true;
                  checkHideSkeleton();
                }}
              />
            </div>
            {/* Close button outside image, fixed at overlay top right */}
            <button
              className="fixed z-50 p-0 m-0 text-5xl font-bold text-white transition-transform duration-200 bg-transparent border-none shadow-none top-6 right-6 hover:scale-110"
              style={{ lineHeight: 1, background: "none", border: "none" }}
              onClick={(e) => {
                e.stopPropagation();
                setEnlarged(false);
              }}
              aria-label={t("close")}
            >
              ×
            </button>
            <style>{`
              @keyframes zoomIn {
                from { transform: scale(0.7); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        )}
        <div className="flex flex-col items-center justify-center flex-1 text-center md:items-start md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-[#f8f8f8] mb-2">
            {productData.name}
          </h1>
          <span className="text-[#bcbcbc] text-lg mb-2">
            {productData.category}
          </span>
          <span className="text-[#bcbcbc] text-base mb-2">
            {productData.description}
          </span>
          <span className="text-[#bcbcbc] text-base mb-4">
            {t("bracelet_gender")}
          </span>
          <span className="text-[#f8f8f8] text-xl font-semibold mb-4">
            €{productData.price}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <button
              className={`px-4 py-2 font-serif transition-colors duration-150 bg-transparent border rounded-md border-slate-300 text-slate-200 hover:bg-slate-300 hover:text-black ${
                added ? "bg-green-600 text-white hover:bg-green-700" : ""
              }`}
              onClick={handleAddToCart}
              disabled={adding}
            >
              {added
                ? t("added", "Added!")
                : adding
                ? t("adding", "Adding...")
                : t("add_to_cart", "Add to Cart")}
            </button>
            <button className="px-4 py-2 font-serif text-black transition-colors duration-150 border rounded-md border-slate-300 bg-slate-200 hover:bg-slate-300">
              {t("buy_now", "Buy Now")}
            </button>
          </div>
        </div>
      </div>
      <section className="mb-8 text-center md:text-left">
        <h2 className="text-xl font-semibold text-[#bcbcbc] mb-2">
          {t("bracelet_description_title")}
        </h2>
        <p className="text-[#e5e5e5] mb-2">{productData.description}</p>
      </section>
      {/* Divider for mobile only */}
      <div className="flex w-full my-6 md:hidden">
        <div className="h-px w-full mx-auto bg-gradient-to-r from-transparent via-[#bcbcbc33] to-transparent" />
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#bcbcbc] mb-2 text-center md:text-left">
          {t("shipping_title")}
        </h2>
        <ul className="text-[#bcbcbc] text-sm list-disc pl-6 mb-2 text-left w-full">
          <li>{t("shipping_boxnow")}</li>
          <li>{t("shipping_geniki")}</li>
          <li>{t("shipping_free")}</li>
          <li>{t("shipping_time")}</li>
        </ul>
        <p className="text-[#e5e5e5] text-sm mt-2">{t("shipping_notice")}</p>
      </section>
      {/* Divider for mobile only */}
      <div className="flex w-full my-6 md:hidden">
        <div className="h-px w-full mx-auto bg-gradient-to-r from-transparent via-[#bcbcbc33] to-transparent" />
      </div>
      <section className="mb-8 text-center md:text-left">
        <p className="text-xl text-[#e5e5e5]">{t("returns_policy")}</p>
        <p className="text-[#e5e5e5] text-sm mt-2">{t("returns_notice")}</p>
      </section>
    </main>
  );
}

export default function RingsPage({ params }) {
  return (
    <CartProvider>
      <RingsPageInner params={params} />
    </CartProvider>
  );
}
