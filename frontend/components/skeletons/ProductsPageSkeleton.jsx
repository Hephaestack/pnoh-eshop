"use client";

import { motion } from "framer-motion";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ProductsPageSkeleton({ viewMode = "grid" }) {
  return (
    <div className="relative min-h-screen px-4 py-10 mx-auto overflow-x-hidden max-w-7xl">
      {/* Header Skeleton */}
      <div className="flex items-center justify-center mb-8">
        <motion.div 
          className="w-64 h-12 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Subtitle Skeleton */}
      <div className="flex justify-center mb-8">
        <motion.div 
          className="w-96 h-6 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>

      {/* Filters and Controls Skeleton */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Search Input Skeleton */}
        <div className="flex justify-center md:justify-start">
          <motion.div 
            className="w-full max-w-md md:max-w-xs h-12 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Filters Row Skeleton */}
        <div className="flex flex-wrap justify-center gap-4 md:flex-row md:justify-start md:items-center">
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={idx}
              className="w-40 h-10 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Products Grid/List Skeleton */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
          >
            <ProductCardSkeleton viewMode={viewMode} />
          </motion.div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.div 
          className="w-10 h-10 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-32 h-10 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div 
          className="w-10 h-10 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
    </div>
  );
}
