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
  const [backUrl, setBackUrl] = useState("/shop/bracelets"); // Default fallback
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { t } = useTranslation();

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

      console.log("Bracelets - Full referrer URL:", referrer); // Debug log
      console.log("Bracelets - Current origin:", currentOrigin); // Debug log

      // First try to get from session storage (more reliable for SPA navigation)
      const previousPath = sessionStorage.getItem("previousPath");
      console.log("Bracelets - Previous path from storage:", previousPath); // Debug log

      let detectedPath = null;

      // Check session storage first (for SPA navigation)
      if (previousPath) {
        detectedPath = previousPath;
      }
      // Fall back to document.referrer (for direct navigation/refresh)
      else if (referrer && referrer.startsWith(currentOrigin)) {
        detectedPath = referrer.replace(currentOrigin, "");
      }

      console.log("Bracelets - Detected path:", detectedPath); // Debug log

      if (detectedPath) {
        // More precise matching for all products page
        if (
          detectedPath === "/shop/products" ||
          detectedPath.startsWith("/shop/products?") ||
          detectedPath.startsWith("/shop/products#")
        ) {
          console.log(
            "Bracelets - ✅ DETECTED ALL PRODUCTS PAGE - Setting back to /shop/products"
          ); // Debug log
          setBackUrl("/shop/products");
        }
        // If coming from bracelets category page
        else if (
          (detectedPath === "/shop/bracelets" ||
            detectedPath.startsWith("/shop/bracelets?")) &&
          !detectedPath.includes("[id]")
        ) {
          console.log(
            "Bracelets - ✅ DETECTED BRACELETS CATEGORY - Setting back to /shop/bracelets"
          ); // Debug log
          setBackUrl("/shop/bracelets");
        }
        // If coming from other category pages, still go to bracelets
        else if (detectedPath.includes("/shop/")) {
          console.log(
            "Bracelets - ✅ DETECTED OTHER SHOP PAGE - Setting back to /shop/bracelets",
            detectedPath
          ); // Debug log
          setBackUrl("/shop/bracelets");
        }
        // Default fallback
        else {
          console.log(
            "Bracelets - ⚠️ FALLBACK - Using default /shop/bracelets for path:",
            detectedPath
          ); // Debug log
          setBackUrl("/shop/bracelets");
        }
      } else {
        console.log(
          "Bracelets - ❌ NO VALID PATH DETECTED - Using default /shop/bracelets"
        ); // Debug log
        setBackUrl("/shop/bracelets");
      }
    }
  }, []);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/products/${routeParams?.id}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!response.ok) {
          throw new Error(`Product not found: ${response.status}`);
        }

        const data = await response.json();
        setProductData({
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
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsLoading(false);
      }
    };

    if (routeParams?.id) {
      fetchProduct();
    }
  }, [routeParams?.id]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b] px-4 py-8">
        <div className="bg-[#232326]/60 rounded-2xl shadow-2xl px-8 py-12 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 w-full max-w-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bcbcbc] mb-6"></div>
            <p className="text-center text-[#f8f8f8] font-medium text-lg">
              Loading Product...
            </p>
            <p className="text-center text-[#bcbcbc] text-sm mt-2">
              Preparing your jewelry details
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (!productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b] px-4 py-8">
        <div className="bg-[#232326]/60 rounded-2xl shadow-2xl px-8 py-12 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 w-full max-w-md">
          <div className="flex flex-col items-center">
            <p className="text-center text-[#f8f8f8] font-medium text-lg mb-4">
              Product not found
            </p>
            <Link
              href="/shop/bracelets"
              className="px-6 py-3 text-black transition-colors rounded-lg bg-slate-200 hover:bg-slate-300"
            >
              Back to Bracelets
            </Link>
          </div>
        </div>
      </div>
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
