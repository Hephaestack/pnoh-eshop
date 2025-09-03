"use client";

import { motion } from "framer-motion";

export const IndividualProductSkeleton = () => {
  return (
    <main className="container max-w-5xl min-h-screen px-4 py-8 mx-auto md:py-12">
      {/* Back button skeleton */}
      <div className="mb-8 md:mb-12">
        <motion.div 
          className="inline-flex items-center gap-3 w-32 h-8 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main product content with enhanced layout */}
      <div className="grid gap-8 mb-16 lg:grid-cols-5 lg:gap-12 md:mb-20">
        {/* Image gallery skeleton - takes 3 columns */}
        <div className="space-y-4 lg:col-span-3 md:space-y-6">
          {/* Main image skeleton */}
          <motion.div 
            className="relative max-w-md mx-auto overflow-hidden shadow-xl aspect-square rounded-2xl bg-[#232326] lg:max-w-none lg:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#ffffff15] to-transparent transform -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>

          {/* Thumbnail gallery skeleton */}
          <div className="flex justify-center gap-3 pb-2 overflow-x-auto lg:justify-start">
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 bg-[#232326] rounded-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Product details skeleton - takes 2 columns */}
        <div className="px-2 space-y-8 text-center lg:col-span-2 lg:text-left lg:px-0">
          {/* Product header skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <motion.div 
                className="w-full h-10 md:h-12 lg:h-14 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-48 h-5 bg-[#232326] rounded mx-auto lg:mx-0"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
            </div>
            
            <motion.div 
              className="w-32 h-10 bg-[#232326] rounded-lg mx-auto lg:mx-0"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>

          {/* Description skeleton */}
          <div className="space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div>
              <motion.div 
                className="w-24 h-5 bg-[#232326] rounded mb-3 mx-auto lg:mx-0"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              {[...Array(3)].map((_, idx) => (
                <motion.div
                  key={idx}
                  className="w-full h-4 bg-[#232326] rounded mb-2"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 + idx * 0.05 }}
                />
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Add to cart section skeleton */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row lg:max-w-none lg:mx-0">
              <motion.div 
                className="w-full sm:w-40 h-12 bg-[#232326] rounded-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.div 
                className="w-full sm:w-32 h-12 bg-[#232326] rounded-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional information sections skeleton */}
      <div className="max-w-2xl px-2 mx-auto space-y-8 md:space-y-8 md:max-w-none md:px-0">
        <section className="space-y-4 text-center md:space-y-4 md:text-left">
          <motion.div 
            className="w-48 h-6 bg-[#232326] rounded mx-auto md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <div className="space-y-3 max-w-md mx-auto md:max-w-none md:mx-0">
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={idx}
                className="w-full h-4 bg-[#232326] rounded"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.65 + idx * 0.05 }}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4 text-center md:space-y-4 md:text-left">
          <motion.div 
            className="w-40 h-6 bg-[#232326] rounded mx-auto md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
          <motion.div 
            className="w-full h-4 bg-[#232326] rounded max-w-md mx-auto md:max-w-none md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
          />
        </section>
      </div>
    </main>
  );
};

export default IndividualProductSkeleton;
