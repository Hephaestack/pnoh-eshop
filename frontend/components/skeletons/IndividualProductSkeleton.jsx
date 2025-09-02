"use client";

import { motion } from "framer-motion";

export function IndividualProductSkeleton() {
  return (
    <main className="container max-w-5xl min-h-screen px-4 py-8 mx-auto md:py-12">
      {/* Back button skeleton */}
      <div className="mb-8 md:mb-12">
        <div className="inline-flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 bg-[#232326] rounded-full"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-32 h-4 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 mb-16 lg:grid-cols-5 lg:gap-12 md:mb-20">
        {/* Image Section - 3 columns */}
        <div className="space-y-4 lg:col-span-3 md:space-y-6">
          <motion.div 
            className="relative max-w-md mx-auto overflow-hidden shadow-xl aspect-square rounded-2xl bg-[#232326] lg:max-w-none lg:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Thumbnail Row */}
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

        {/* Product Info Section - 2 columns */}
        <div className="px-2 space-y-8 text-center lg:col-span-2 lg:text-left lg:px-0">
          {/* Title and Category */}
          <div className="space-y-4">
            <div className="space-y-2">
              <motion.div 
                className="h-12 w-full bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="h-6 w-1/2 mx-auto lg:mx-0 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
            </div>
            
            <motion.div 
              className="h-10 w-1/3 mx-auto lg:mx-0 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="h-px bg-[#232326]" />
            <div className="space-y-3">
              <motion.div 
                className="h-4 w-40 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <div className="space-y-2">
                <motion.div 
                  className="h-4 w-full bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.div 
                  className="h-4 w-5/6 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div 
                  className="h-4 w-4/6 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
              </div>
            </div>
            <div className="h-px bg-[#232326]" />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row lg:max-w-none lg:mx-0">
              <motion.div 
                className="h-14 flex-1 bg-[#232326] rounded-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              />
              <motion.div 
                className="h-14 flex-1 bg-[#232326] rounded-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="max-w-2xl px-2 mx-auto space-y-8 md:space-y-8 md:max-w-none md:px-0">
        {/* Shipping Section */}
        <section className="space-y-4 text-center md:text-left">
          <motion.div 
            className="h-8 w-48 bg-[#232326] rounded-lg mx-auto md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          />
          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <motion.div 
                  className="w-1.5 h-1.5 mt-2.5 bg-[#232326] rounded-full flex-shrink-0"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 + (idx * 0.1) }}
                />
                <motion.div 
                  className="h-4 flex-1 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 + (idx * 0.1) }}
                />
              </div>
            ))}
          </div>
          <motion.div 
            className="h-4 w-64 bg-[#232326] rounded-lg mx-auto md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          />
        </section>

        {/* Returns Section */}
        <section className="space-y-4 text-center md:text-left">
          <motion.div 
            className="h-8 w-48 bg-[#232326] rounded-lg mx-auto md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div 
            className="h-4 w-64 bg-[#232326] rounded-lg mx-auto md:mx-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
          />
        </section>
      </div>
    </main>
  );
}
