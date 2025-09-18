"use client";

import "../i18n/i18n";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import TopHeader from "@/components/top-header";

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true); // Start with loading overlay
  const [showContent, setShowContent] = useState(false); // Start with content hidden
  const transitionMs = 600; // Longer transition for more visible effect
  const fallbackRef = useRef(null);
  const loadingDelayRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only show loading for routes that actually need it (dynamic product pages)
    const isDynamicRoute = pathname.includes('[') || pathname.includes('/shop/') && pathname.split('/').length > 3;
    const isProductPage = pathname.includes('/shop/') && pathname.split('/').length > 3 && !pathname.includes('/categories');
    // If we're navigating to a product page, immediately scroll to top so
    // the skeleton / page appears at the top of the viewport instead of
    // preserving the previous scroll position.
    if (typeof window !== 'undefined' && isProductPage) {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {
        // ignore
      }
    }

    if (isDynamicRoute && !isProductPage) {
      // Delay showing loading overlay to avoid flash for fast operations
      loadingDelayRef.current = setTimeout(() => {
        setLoading(true);
        setShowContent(false);
      }, 150); // Only show loading if operation takes longer than 150ms
    } else {
      // For static routes and product pages (which handle their own loading), show content immediately
      setLoading(false);
      setShowContent(true);
      return;
    }

    const onPageReady = () => {
      // Clear the loading delay if page becomes ready quickly
      if (loadingDelayRef.current) {
        clearTimeout(loadingDelayRef.current);
        loadingDelayRef.current = null;
      }
      
      // reveal content (start fade-in)
      setShowContent(true);
      // after transition completes, remove overlay
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
      fallbackRef.current = setTimeout(() => {
        setLoading(false);
        fallbackRef.current = null;
      }, transitionMs + 30);
      window.removeEventListener("page-ready", onPageReady);
    };

    // Reduced fallback timeout for faster loading
    fallbackRef.current = setTimeout(() => {
      if (loadingDelayRef.current) {
        clearTimeout(loadingDelayRef.current);
        loadingDelayRef.current = null;
      }
      setShowContent(true);
      fallbackRef.current = setTimeout(() => {
        setLoading(false);
        fallbackRef.current = null;
      }, transitionMs + 30);
    }, 800); // Reduced from 1200ms to 800ms

    window.addEventListener("page-ready", onPageReady);

    return () => {
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
      if (loadingDelayRef.current) clearTimeout(loadingDelayRef.current);
      window.removeEventListener("page-ready", onPageReady);
    };
  }, [pathname]);

  return (
    <>
      {loading && <LoadingIndicator />}
      <TopHeader />
      <Header />
      <main
        className={`transition-opacity duration-200`}
        style={{
          opacity: showContent ? 1 : 0,
          visibility: showContent ? "visible" : "hidden",
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
