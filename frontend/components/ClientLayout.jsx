"use client";

import "../i18n/i18n";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import TopHeader from "@/components/top-header";

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true); // controls overlay visibility
  const [showContent, setShowContent] = useState(false); // controls main opacity
  const transitionMs = 300; // must match the CSS transition duration
  const fallbackRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // start hidden
    setLoading(true);
    setShowContent(false);

    const onPageReady = () => {
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

    // Fallback in case page never signals readiness: reveal content then remove overlay
    fallbackRef.current = setTimeout(() => {
      setShowContent(true);
      fallbackRef.current = setTimeout(() => {
        setLoading(false);
        fallbackRef.current = null;
      }, transitionMs + 30);
    }, 1200);

    window.addEventListener("page-ready", onPageReady);

    return () => {
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
      window.removeEventListener("page-ready", onPageReady);
    };
  }, [pathname]);

  return (
    <>
      {loading && <LoadingIndicator />}
      <TopHeader />
      <Header />
      <main
        className={`transition-opacity duration-300`}
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
