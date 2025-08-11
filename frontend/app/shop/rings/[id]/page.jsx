"use client"

import React from "react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function RingsPage({ params }) {
  const routeParams = React.use(params);
  const [enlarged, setEnlarged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
 
  const { t } = useTranslation();
  // Animation state (must be refs to persist across renders)
  const animationFrame = useRef(null);
  const target = useRef({ tx: 0, ty: 0, rx: 0, ry: 0 });
  const current = useRef({ tx: 0, ty: 0, rx: 0, ry: 0 });

  // TODO: Replace with actual API call when backend is ready
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulate API call - replace with: 
        // const response = await fetch(`/api/products/${params.id}`);
        // const data = await response.json();
        // setProductData(data);
        
        // Temporary: simulate API delay and set mock data
        const timer = setTimeout(() => {
          setProductData({
            id: routeParams?.id || 1,
            name: "Elegant Ring",
            price: 85,
            description: "Beautiful handcrafted ring",
            image: "/images/test2.jpg"
          });
          setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [routeParams?.id]);

  // Show loading state while fetching data
  if (isLoading || !productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b] px-4 py-8">
        <div className="bg-[#232326]/60 rounded-2xl shadow-2xl px-8 py-12 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 w-full max-w-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bcbcbc] mb-6"></div>
            <p className="text-center text-[#f8f8f8] font-medium text-lg">Loading Product...</p>
            <p className="text-center text-[#bcbcbc] text-sm mt-2">Preparing your jewelry details</p>
          </div>
        </div>
      </div>
    );
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function animate() {
    // Lower lerp for more stickiness
    const lerp = (a, b, n) => a + (b - a) * n;
    current.current.tx = lerp(current.current.tx, target.current.tx, 0.10);
    current.current.ty = lerp(current.current.ty, target.current.ty, 0.10);
    current.current.rx = lerp(current.current.rx, target.current.rx, 0.10);
    current.current.ry = lerp(current.current.ry, target.current.ry, 0.10);
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
    img.style.transition = 'transform 0.7s cubic-bezier(.22,1,.36,1)';
    img.style.transform = "translate(0px,0px) rotateX(0deg) rotateY(0deg) scale(1)";
    setTimeout(() => {
      if (img) img.style.transition = '';
    }, 700);
    // Reset current for next hover
    current.current = { tx: 0, ty: 0, rx: 0, ry: 0 };
  }

  return (
    <main className="max-w-2xl min-h-screen px-4 py-10 mx-auto text-center md:text-left">
      <Link href="/collections" className="text-[#bcbcbc] hover:text-[#f8f8f8] text-sm mb-6 inline-block">{t('back_to_collection')}</Link>
      <div className="flex flex-col items-center w-full gap-8 mb-10 md:flex-row md:items-start">
        <div
          ref={containerRef}
          className="flex items-center justify-center flex-shrink-0 w-full cursor-pointer md:w-1/2"
          style={{ perspective: '1200px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setEnlarged(true)}
        >
          <img
            ref={imgRef}
            src="/images/test2.jpg"
            alt="Βραχιόλι Touareg"
            className="rounded-xl shadow-xl object-cover w-full max-w-xs bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md transition-transform duration-300"
            style={{ transformStyle: 'preserve-3d', cursor: 'zoom-in' }}
          />
        </div>

        {/* Enlarged image overlay */}
        {enlarged && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setEnlarged(false)}
          >
            <div
              className="relative transition-all duration-500 ease-out scale-90 opacity-0 animate-zoomIn"
              style={{ animation: 'zoomIn 0.5s cubic-bezier(.22,1,.36,1) forwards' }}
            >
              <img
                src="/images/test2.jpg"
                alt="Βραχιόλι Touareg"
                className="rounded-xl shadow-2xl object-contain max-h-[90vh] max-w-[95vw] transition-transform duration-500"
                style={{ cursor: 'zoom-out' }}
              />
            </div>
            {/* Close button outside image, fixed at overlay top right */}
            <button
              className="fixed z-50 p-0 m-0 text-5xl font-bold text-white transition-transform duration-200 bg-transparent border-none shadow-none top-6 right-6 hover:scale-110"
              style={{ lineHeight: 1, background: 'none', border: 'none' }}
              onClick={e => { e.stopPropagation(); setEnlarged(false); }}
              aria-label={t('close')}
            >×</button>
            <style>{`
              @keyframes zoomIn {
                from { transform: scale(0.7); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        )}
        <div className="flex flex-col items-center justify-center flex-1 text-center md:items-start md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-[#f8f8f8] mb-2">{t('bracelet_title')}</h1>
          <span className="text-[#bcbcbc] text-lg mb-2">{t('bracelet_material')}</span>
          <span className="text-[#bcbcbc] text-base mb-2">{t('bracelet_design')}</span>
          <span className="text-[#bcbcbc] text-base mb-4">{t('bracelet_gender')}</span>
          <span className="text-[#f8f8f8] text-xl font-semibold mb-4">{t('bracelet_price')}</span>
        </div>
      </div>
      <section className="mb-8 text-center md:text-left">
        <h2 className="text-xl font-semibold text-[#bcbcbc] mb-2">{t('bracelet_description_title')}</h2>
        <p className="text-[#e5e5e5] mb-2">{t('bracelet_description')}</p>
        <ul className="text-[#bcbcbc] text-sm list-disc md:pl-6 pl-0 inline-block md:inline-block text-left mx-auto md:mx-0">
          <li>{t('bracelet_length')}</li>
          <li>{t('bracelet_element_height')}</li>
          <li>{t('bracelet_element_length')}</li>
        </ul>
      </section>
      {/* Divider for mobile only */}
      <div className="flex w-full my-6 md:hidden">
        <div className="h-px w-full mx-auto bg-gradient-to-r from-transparent via-[#bcbcbc33] to-transparent" />
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#bcbcbc] mb-2 text-center md:text-left">{t('shipping_title')}</h2>
        <ul className="text-[#bcbcbc] text-sm list-disc pl-6 mb-2 text-left w-full">
          <li>{t('shipping_boxnow')}</li>
          <li>{t('shipping_geniki')}</li>
          <li>{t('shipping_free')}</li>
          <li>{t('shipping_time')}</li>
        </ul>
        <p className="text-[#e5e5e5] text-sm mt-2">{t('shipping_notice')}</p>
      </section>
      {/* Divider for mobile only */}
      <div className="flex w-full my-6 md:hidden">
        <div className="h-px w-full mx-auto bg-gradient-to-r from-transparent via-[#bcbcbc33] to-transparent" />
      </div>
      <section className="mb-8 text-center md:text-left">
        <p className="text-xl text-[#e5e5e5]">{t('returns_policy')}</p>
        <p className="text-[#e5e5e5] text-sm mt-2">{t('returns_notice')}</p>
      </section>
    </main>
  );
}
