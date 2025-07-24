"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


import { useTranslation } from "react-i18next";

const items = [
  {
    id: 1,
    title: "hero_diamond_ring",
    img: "/images/test2.jpg",
  },
  {
    id: 2,
    title: "hero_emerald_necklace",
    img: "/images/test2.jpg",
  },
  {
    id: 3,
    title: "hero_luxury_watch",
    img: "/images/test2.jpg",
  },
  {
    id: 4,
    title: "hero_sapphire_earrings",
    img: "/images/test2.jpg",
  },
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

  // Swipe handlers (mobile only)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Resettable autoplay
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



  return (
    <motion.section
      className="relative flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] py-20 overflow-hidden border-b border-[#23232a]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Enhanced depth background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1: Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.07)_1px,_transparent_0)] bg-[length:24px_24px]" />
        {/* Layer 2: Blurred colored shapes for depth */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#3b82f6]/30 rounded-full blur-3xl opacity-40" style={{filter:'blur(120px)'}} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#f59e42]/20 rounded-full blur-2xl opacity-30" style={{filter:'blur(80px)'}} />
        {/* Layer 3: Vignette for focus */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40" />
      </div>

      <motion.div
        className="relative z-10 mb-12 text-center"
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
      </motion.div>
      <motion.div
        className="relative flex items-center justify-center w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 z-20 items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full bg-[#23232a]/60 backdrop-blur-md border border-[#353545] shadow-lg hover:bg-[#18181b]/80 text-gray-200 hover:text-white transition-all duration-300 top-1/2 group"
          aria-label="Previous"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5 transition-transform duration-200 transform group-hover:scale-110'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>
        <div
          className="flex items-center justify-center w-full max-w-6xl h-[32rem] perspective-[1400px] overflow-visible"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, idx) => {
            const offset = idx - centerIdx;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            // Enhanced 3D positioning
            const rotateY = offset * -25;
            const scale = isCenter ? 1 : 0.85 - absOffset * 0.1;
            const translateX = offset * 200;
            const translateZ = isCenter ? 0 : -100 * absOffset;
            const opacity = isCenter ? 1 : Math.max(0.3, 0.8 - absOffset * 0.2);
            const zIndex = 20 - absOffset;
            return (
              <motion.div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                style={{
                  zIndex,
                  opacity,
                  pointerEvents: isCenter ? "auto" : "none",
                }}
                animate={{
                  scale,
                  rotateY,
                  x: translateX,
                  z: translateZ,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 0.8
                }}
              >
                <div className="cursor-pointer group">
                  {/* Glass card container */}
                  <div className="relative overflow-hidden w-[23rem] h-[27rem] md:w-[28rem] md:h-[32rem] rounded-3xl shadow-2xl">
                    {/* Dark glassmorphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#23232a]/80 via-[#18181b]/70 to-[#23232a]/60 backdrop-blur-xl border border-[#353545] shadow-2xl rounded-2xl" />
                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 shadow-inner rounded-2xl" />
                    {/* Image container */}
                    <div className="relative w-full h-[19rem] md:h-[23rem] overflow-hidden rounded-t-3xl">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-700 ease-out transform group-hover:scale-105"
                        draggable="false"
                      />
                      {/* Gradient overlay for dark */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Shine effect (subtle for dark) */}
                      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:opacity-80" />
                    </div>
                    {/* Content area */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="mb-2 text-xl font-semibold tracking-wide text-gray-100 goth-title">
                        {t(item.title)}
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-gray-400/60 to-transparent" />
                    </div>
                    {/* Reflection effect (dark) */}
                    <div className="absolute h-8 -bottom-2 left-2 right-2 bg-gradient-to-b from-white/10 to-transparent rounded-b-2xl blur-sm opacity-30" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 z-20 items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full bg-[#23232a]/60 backdrop-blur-md border border-[#353545] shadow-lg hover:bg-[#18181b]/80 text-gray-200 hover:text-white transition-all duration-300 top-1/2 group"
          aria-label="Next"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5 transition-transform duration-200 transform group-hover:scale-110'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </motion.div>
      {/* Indicators */}
      <motion.div
        className="z-10 flex mt-8 space-x-2"
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
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === centerIdx 
                ? 'bg-[#353545] w-8' 
                : 'bg-[#23232a] hover:bg-[#353545]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </motion.div>
    </motion.section>
    
  );
}

export default Hero;
