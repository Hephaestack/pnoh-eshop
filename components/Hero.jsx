"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const items = [
  { id: 1, title: "hero_diamond_ring", img: "/images/test2.jpg" },
  { id: 2, title: "hero_emerald_necklace", img: "/images/test2.jpg" },
  { id: 3, title: "hero_luxury_watch", img: "/images/test2.jpg" },
  { id: 4, title: "hero_sapphire_earrings", img: "/images/test2.jpg" },
];

export function Hero() {
  const { t } = useTranslation();
  const [centerIdx, setCenterIdx] = useState(1);
  const intervalRef = useRef();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handlePrev = useCallback(() => {
    setCenterIdx((prev) => (prev - 1 + items.length) % items.length);
    startAutoplay();
  }, []);

  const handleNext = useCallback(() => {
    setCenterIdx((prev) => (prev + 1) % items.length);
    startAutoplay();
  }, []);

  const handleTouchStart = (e) => {
    const touchX = e.touches[0].clientX;
    touchStartX.current = touchX;
    touchEndX.current = touchX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      diff > 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const startAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCenterIdx((prev) => (prev + 1) % items.length);
    }, 3500);
  }, []);

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
    <motion.section
      className="relative flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] py-20 overflow-hidden border-b border-[#23232a]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
 
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.07)_1px,_transparent_0)] bg-[length:24px_24px]" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#3b82f6]/30 rounded-full blur-3xl opacity-40" style={{ filter: 'blur(120px)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#f59e42]/20 rounded-full blur-2xl opacity-30" style={{ filter: 'blur(80px)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40" />
      </div>

      {/* Title */}
      <motion.div className="relative z-10 mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <h1 className="mb-4 text-4xl font-light tracking-wide text-gray-100 md:text-6xl goth-title">
          {t('our_jewelry')}
        </h1>
        <p className="text-lg font-light tracking-wide text-gray-300 md:text-xl">
          {t('your_art')}
        </p>
        <Link href="/collections">
          <button className="mt-6 px-6 py-2 text-sm font-medium text-white bg-[#353545]/70 rounded-full hover:bg-[#353545] transition-all duration-300 shadow">
            {t('explore_collection')}
          </button>
        </Link>
      </motion.div>

      {/* Carousel */}
      <motion.div className="relative flex items-center justify-center w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        {/* Prev Button */}
        <button onClick={handlePrev} aria-label="Previous"
          className="hidden md:flex absolute left-8 z-20 items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full bg-[#23232a]/60 backdrop-blur-md border border-[#353545] shadow-lg hover:bg-[#18181b]/80 text-gray-200 hover:text-white transition-all duration-300 top-1/2 group"
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>

        <div
          className="flex items-center justify-center w-full max-w-6xl h-[32rem] perspective-[1400px] overflow-visible"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => clearInterval(intervalRef.current)}
          onMouseLeave={startAutoplay}
        >
          {items.map((item, idx) => {
            const offset = idx - centerIdx;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const rotateY = offset * -25;
            const scale = isCenter ? 1 : 0.85 - absOffset * 0.1;
            const translateX = offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 200);
            const translateZ = isCenter ? 0 : -100 * absOffset;
            const opacity = isCenter ? 1 : Math.max(0.3, 0.8 - absOffset * 0.2);
            const zIndex = 20 - absOffset;

            return (
              <motion.div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                style={{ zIndex, opacity, pointerEvents: isCenter ? "auto" : "none" }}
                animate={{ scale, rotateY, x: translateX, z: translateZ }}
                transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8, delay: absOffset * 0.05 }}
              >
                <div className="cursor-pointer group">
                  <div className="relative overflow-hidden w-[20rem] md:w-[28rem] h-[26rem] md:h-[32rem] rounded-3xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#23232a]/80 via-[#18181b]/70 to-[#23232a]/60 backdrop-blur-xl border border-[#353545] shadow-2xl rounded-2xl" />
                    <div className="absolute inset-0 shadow-inner rounded-2xl" />
                    <div className="relative w-full h-[18rem] md:h-[23rem] overflow-hidden rounded-t-3xl">
                      <Image
                        src={item.img}
                        alt={t(item.title)}
                        fill
                        priority={isCenter}
                        className="object-cover transition-transform duration-700 ease-out transform group-hover:scale-105"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:opacity-80" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Only show text for center card */}
                      {isCenter && (
                        <>
                          <h3 className="mb-1 text-xl font-semibold tracking-wide text-gray-100 goth-title">
                            {t(item.title)}
                          </h3>
                          <p className="text-sm font-light text-gray-400">Limited Edition</p>
                          <div className="w-12 h-0.5 mt-2 bg-gradient-to-r from-gray-400/60 to-transparent" />
                        </>
                      )}
                    </div>
                    <div className="absolute h-8 -bottom-2 left-2 right-2 bg-gradient-to-b from-white/10 to-transparent rounded-b-2xl blur-sm opacity-30" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next Button */}
        <button onClick={handleNext} aria-label="Next"
          className="hidden md:flex absolute right-8 z-20 items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full bg-[#23232a]/60 backdrop-blur-md border border-[#353545] shadow-lg hover:bg-[#18181b]/80 text-gray-200 hover:text-white transition-all duration-300 top-1/2 group"
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </motion.div>

      {/* Indicators */}
      <motion.div className="z-10 flex mt-8 space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCenterIdx(idx);
              startAutoplay();
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === centerIdx ? 'bg-[#353545] w-8' : 'bg-[#23232a] hover:bg-[#353545]'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </motion.div>

      {/* ARIA live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {t(items[centerIdx].title)}
      </div>
    </motion.section>
  );
}

export default Hero;
