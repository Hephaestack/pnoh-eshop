"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    id: 1,
    title: "Diamond Ring",
    img: "/images/test.webp",
  },
  {
    id: 2,
    title: "Emerald Necklace",
    img: "/images/test.webp",
  },
  {
    id: 3,
    title: "Luxury Watch",
    img: "/images/test.webp",
  },
  {
    id: 4,
    title: "Sapphire Earrings",
    img: "/images/test.webp",
  },
];




export function Hero() {
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
    <section className="relative flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-[#18181b] to-[#23232a] py-12 border-b border-[#23232a] overflow-x-hidden">
      <h1 className="flex items-center justify-center gap-3 mb-8 text-3xl font-black tracking-tight text-center text-gray-100 md:text-5xl drop-shadow-2xl goth-title">
        Τα κοσμήματα μας, η τέχνη σας
      </h1>
      <div className="relative flex items-center justify-center w-full overflow-x-hidden">
        <button
          onClick={handlePrev}
          className="hidden md:block absolute left-0 z-10 p-2 -translate-y-1/2 border-2 border-slate-300 rounded-full shadow-md bg-[#23232a]/80 hover:bg-[#18181b] text-slate-200 transition-colors duration-200 md:left-8 top-1/2"
          aria-label="Previous"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>
        <div
          className="flex items-center justify-center w-full max-w-3xl h-80 perspective-[1200px] overflow-x-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, idx) => {
            const offset = idx - centerIdx;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            // 3D rotation and scaling
            const rotateY = offset *  -40;
            const scale = isCenter ? 1.1 : 0.85 - absOffset * 0.05;
            // Remove blur effect
            const glow = "";
            const zIndex = 10 - absOffset;
            const opacity = isCenter ? 1 : 0.7 - absOffset * 0.1;
            return (
              <motion.div
                key={item.id}
                className={"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}
                style={{
                  zIndex,
                  opacity,
                  pointerEvents: isCenter ? "auto" : "none",
                }}
                animate={{
                  scale,
                  rotateY,
                  x: offset * 180,
                  filter: "none",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className={`relative flex flex-col items-center justify-end w-56 overflow-hidden border-2 border-slate-300 h-72 rounded-3xl bg-gradient-to-b from-[#23232a]/90 to-[#18181b]/80${!isCenter ? ' blur-sm opacity-80' : ''}`}> 
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover object-center pointer-events-none select-none rounded-t-3xl border-b-2 border-[#23232a]"
                    style={{ aspectRatio: '1/1.25', minHeight: 0, minWidth: 0 }}
                    draggable="false"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#18181b]/90 to-transparent" />
                  <div className="absolute left-0 w-full text-lg font-semibold tracking-wide text-center text-slate-200 bottom-2 drop-shadow-goth goth-title">
                    {item.title}
                  </div>
                  {/* Reflection */}
                  <div className="absolute bottom-[-60px] left-0 w-full h-16 overflow-hidden pointer-events-none">
                    <img
                      src={item.img}
                      alt="reflection"
                      className="object-cover w-full h-full opacity-20 scale-y-[-1]"
                      draggable="false"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#18181b]/80 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-0 z-10 p-2 -translate-y-1/2 border-2 border-slate-300 rounded-full shadow-md bg-[#23232a]/80 hover:bg-[#18181b] text-slate-200 transition-colors duration-200 md:right-8 top-1/2"
          aria-label="Next"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
    
    </section>
  );
}

export default Hero;
