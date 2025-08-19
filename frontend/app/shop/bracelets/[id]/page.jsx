"use client";

import React from "react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "../../../cart-context";

function BraceletPageInner({ params }) {
  const routeParams = React.use(params);
  const router = useRouter();
  const [enlarged, setEnlarged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [backUrl, setBackUrl] = useState("/shop/bracelets"); // Default fallback
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

  // Signal to the root layout that this page is ready (used to remove the universal loader)
  useEffect(() => {
    if (!isLoading) {
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

      // First try to get from session storage (more reliable for SPA navigation)
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
          (detectedPath === "/shop/bracelets" ||
            detectedPath.startsWith("/shop/bracelets?")) &&
          !detectedPath.includes("[id]")
        ) {
          setBackUrl("/shop/bracelets");
        } else if (detectedPath.includes("/shop/")) {
          setBackUrl("/shop/bracelets");
        } else {
          setBackUrl("/shop/bracelets");
        }
      } else {
        setBackUrl("/shop/bracelets");
      }
    }
  }, []);

  // Fetch product from API with request-id guard, abort, image preload and skeleton timing
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

        if (reqId !== requestIdRef.current) return; // stale

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

        // Preload image
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
        if (error.name === "AbortError") return;
        console.error("Error fetching product:", error);
      } finally {
        const elapsed = Date.now() - loadingStartRef.current;
        const remaining = Math.max(0, SKELETON_MIN_MS - elapsed);
        if (remaining > 0) setTimeout(checkHideSkeleton, remaining);
        else checkHideSkeleton();
      }
    };

    if (routeParams?.id) fetchProduct();

    return () => {
      controller.abort();
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
        skeletonTimerRef.current = null;
      }
    };
  }, [routeParams?.id]);

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
        className="max-w-4xl min-h-screen px-6 py-12 mx-auto text-center md:text-left"
        aria-hidden
      >
        <div className="animate-pulse">
          {/* back link skeleton */}
          <div className="mb-6">
            <div className="w-32 h-5 mx-auto bg-gray-600 rounded md:mx-0" />
          </div>

          <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-12">
            {/* left: large image area */}
            <div className="flex items-start justify-center md:col-span-7">
              <div className="w-full max-w-2xl bg-gradient-to-br from-[#232326]/50 to-[#232326]/40 rounded-xl p-6 shadow-xl">
                <div className="w-full mb-4 bg-gray-600 rounded-lg h-96" />
                <div className="flex justify-center gap-3 md:justify-start">
                  <div className="bg-gray-600 rounded-full w-14 h-14" />
                  <div className="bg-gray-600 rounded-full w-14 h-14" />
                  <div className="bg-gray-600 rounded-full w-14 h-14" />
                </div>
              </div>
            </div>

            {/* right: sticky info card skeleton */}
            <div className="md:col-span-5">
              <div className="sticky top-24">
                <div className="bg-[#232326]/60 border border-[#bcbcbc33] rounded-2xl p-6 shadow-lg backdrop-blur-md">
                  <div className="w-3/4 h-8 mb-4 bg-gray-600 rounded" />
                  <div className="w-1/3 h-6 mb-4 bg-gray-700 rounded" />
                  <div className="w-full h-4 mb-2 bg-gray-600 rounded" />
                  <div className="w-full h-4 mb-2 bg-gray-600 rounded" />
                  <div className="flex items-center gap-3 mt-6">
                    <div className="h-12 bg-gray-600 rounded w-36" />
                    <div className="w-24 h-12 bg-gray-600 rounded" />
                  </div>
                  <div className="w-1/2 h-3 mt-6 bg-gray-600 rounded" />
                </div>
              </div>
            </div>
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
          href="/shop/bracelets"
          className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 inline-block"
        >
          {t("back_to_collection")}
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

  if (!productData) {
    return (
      <main className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left">
        <Link
          href="/shop/bracelets"
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
          <div className="relative border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden backdrop-blur-md backdrop-saturate-150 w-full max-w-xs">
            <img
              src={productData?.image || "/images/test2.jpg"}
              alt={productData?.name || "Product Image"}
              className="object-cover w-full h-full"
              style={{ cursor: "zoom-in" }}
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
                src={productData?.image || "/images/test2.jpg"}
                alt={productData?.name || "Product Image"}
                className="shadow-2xl object-contain max-h-[90vh] max-w-[95vw] transition-transform duration-500"
                style={{ cursor: "zoom-out" }}
              />
            </div>
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
            {productData?.name}
          </h1>
          <span className="text-[#bcbcbc] text-lg mb-2">
            {productData?.category}
          </span>
          <span className="text-[#bcbcbc] text-base mb-2">
            {productData?.description}
          </span>
          <span className="text-[#bcbcbc] text-base mb-4">
            {t("bracelet_gender")}
          </span>
          <span className="text-[#f8f8f8] text-xl font-semibold mb-4">
            €{productData?.price}
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
        <p className="text-[#e5e5e5] mb-2">{productData?.description}</p>
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

export default function BraceletPage({ params }) {
  return (
    <CartProvider>
      <BraceletPageInner params={params} />
    </CartProvider>
  );
}
