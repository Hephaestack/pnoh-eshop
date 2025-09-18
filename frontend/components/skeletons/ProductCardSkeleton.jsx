"use client";

import { motion } from "framer-motion";

export function ProductCardSkeleton({ viewMode = "grid" }) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden backdrop-blur-md backdrop-saturate-150"
          : "hidden lg:flex relative rounded-md border border-[#bcbcbc33] bg-[#232326]/60 shadow-lg overflow-hidden flex-row gap-4 items-center p-4 backdrop-blur-md backdrop-saturate-150"
      }
    >
      {/* Image skeleton */}
      <motion.div
        className={
          viewMode === "grid"
            ? "relative w-full aspect-square bg-[#232326] mb-4 flex items-center justify-center overflow-hidden"
            : "relative w-28 h-28 bg-[#232326] flex items-center justify-center overflow-hidden flex-shrink-0 rounded-lg"
        }
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content skeleton */}
      <div className={viewMode === "grid" ? "px-4 pb-4" : "flex-1 min-w-0 px-4"}>
        {/* Title skeleton */}
        <motion.div 
          className="h-6 mb-2 bg-[#232326] rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
        
        {/* Category/Theme skeleton */}
        <motion.div 
          className="h-4 w-2/3 bg-[#232326] rounded-lg mt-2"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Price skeleton */}
        <motion.div 
          className="h-5 w-1/4 bg-[#232326] rounded-lg mt-3"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Buttons skeleton - Only show in grid mode */}
        {viewMode === "grid" && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <motion.div 
              className="h-10 w-32 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.div 
              className="h-10 w-32 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
        )}
      </div>

      {/* Action buttons for list view */}
      {viewMode === "list" && (
        <div className="flex items-center justify-end gap-2 w-48">
          <motion.div 
            className="h-10 w-32 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div 
            className="h-10 w-32 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
      )}
    </div>
  );
}
