"use client";

import { motion } from "framer-motion";
import { Grid, List } from "lucide-react";

const ProductCardSkeleton = ({ viewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden backdrop-blur-md backdrop-saturate-150">
        {/* Image Skeleton */}
        <motion.div 
          className="relative w-full aspect-square bg-[#232326] mb-4"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Content */}
        <div className="px-2 pb-2 text-center">
          {/* Title */}
          <motion.div 
            className="h-6 bg-[#232326] rounded-lg mb-1 mx-auto"
            style={{ width: '80%' }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          {/* Category */}
          <motion.div 
            className="h-4 bg-[#232326] rounded-lg mb-2 mx-auto"
            style={{ width: '60%' }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          {/* Price */}
          <motion.div 
            className="h-6 w-20 bg-[#232326] rounded-lg mx-auto mb-3"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          {/* Buttons */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <motion.div 
              className="h-10 w-24 bg-[#232326] rounded-md"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.div 
              className="h-10 w-24 bg-[#232326] rounded-md"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden backdrop-blur-md backdrop-saturate-150">
      <div className="flex items-center gap-4 p-4">
        {/* Image */}
        <motion.div 
          className="w-28 h-28 bg-[#232326] rounded-lg flex-shrink-0"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Content */}
        <div className="flex-1">
          <motion.div 
            className="h-6 bg-[#232326] rounded-lg mb-2"
            style={{ width: '60%' }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div 
            className="h-4 bg-[#232326] rounded-lg mb-2"
            style={{ width: '40%' }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            className="h-5 w-20 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </div>
        {/* Buttons */}
        <div className="flex gap-2">
          <motion.div 
            className="h-10 w-24 bg-[#232326] rounded-md"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div 
            className="h-10 w-24 bg-[#232326] rounded-md"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export function CategoryPageSkeleton() {
  return (
    <main className="relative min-h-screen px-4 py-10 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <motion.div 
          className="h-12 md:h-16 bg-[#232326] rounded-lg"
          style={{ width: '60%', maxWidth: '400px' }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div 
        className="h-6 bg-[#232326] rounded-lg mb-12 mx-auto"
        style={{ width: '80%', maxWidth: '600px' }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />

      {/* Filters and Controls */}
      <div className="flex flex-col items-center justify-center gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        {/* Theme Dropdown */}
        <motion.div 
          className="h-10 w-48 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />

        {/* View Mode Toggle */}
        <div className="items-center hidden gap-2 lg:flex">
          <div className="p-2 text-[#bcbcbc]">
            <Grid className="w-5 h-5" />
          </div>
          <div className="p-2 text-[#bcbcbc]">
            <List className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <motion.div 
        className="h-5 w-48 bg-[#232326] rounded-lg mb-6"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Product Grid */}
      <div style={{ minHeight: "400px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(9)].map((_, index) => (
            <ProductCardSkeleton key={index} viewMode="grid" />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-6 mt-12">
        {/* Previous */}
        <motion.div 
          className="h-10 w-36 bg-[#232326] rounded-md"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        {/* Page Number */}
        <motion.div 
          className="h-14 w-14 bg-[#232326] rounded-md"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Next */}
        <motion.div 
          className="h-10 w-36 bg-[#232326] rounded-md"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </div>

      {/* Back to All Products */}
      <div className="flex justify-center mt-12">
        <motion.div 
          className="h-12 w-48 bg-[#232326] rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
      </div>
    </main>
  );
}
