"use client";

import { motion } from "framer-motion";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function CategoryPageSkeleton({ viewMode = "grid" }) {
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
        {/* Search Input and View Toggle Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          {/* Search Input Skeleton */}
          <motion.div 
            className="w-full max-w-md md:max-w-xs h-12 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* View Toggle Skeleton */}
          <motion.div 
            className="w-24 h-10 bg-[#232326] rounded-lg ml-auto"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
        </div>

        {/* Filters Row Skeleton */}
        <div className="flex flex-wrap justify-center gap-4 md:flex-row md:justify-start md:items-center">
          {/* Filter dropdowns */}
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={idx}
              className="w-40 h-10 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
            />
          ))}
          
          {/* Sort dropdown */}
          <motion.div
            className="w-32 h-10 bg-[#232326] rounded-lg ml-auto"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </div>
      </div>

      {/* Product count and pagination info skeleton */}
      <div className="flex justify-between items-center mb-6">
        <motion.div 
          className="w-40 h-5 bg-[#232326] rounded"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-32 h-5 bg-[#232326] rounded"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
      </div>

      {/* Products Grid/List Skeleton */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" 
        : "flex flex-col gap-4 mb-8"
      }>
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <ProductCardSkeleton viewMode={viewMode} />
          </motion.div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2">
        {/* Previous button */}
        <motion.div 
          className="w-20 h-10 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Page numbers */}
        {[...Array(5)].map((_, idx) => (
          <motion.div
            key={idx}
            className="w-10 h-10 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.05 }}
          />
        ))}
        
        {/* Next button */}
        <motion.div 
          className="w-20 h-10 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
        />
      </div>

      {/* Loading overlay effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#ffffff05] to-transparent transform -skew-x-12" />
      </motion.div>
    </div>
  );
}

export default CategoryPageSkeleton;
