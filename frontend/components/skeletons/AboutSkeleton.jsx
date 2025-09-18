"use client";

import { motion } from "framer-motion";

export const AboutSkeleton = () => {
  return (
    <div className="bg-[#18181b] text-[#e5e7eb] min-h-screen">
      {/* Hero Section Skeleton */}
      <motion.section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          {/* Title skeleton */}
          <motion.div 
            className="w-64 h-12 bg-[#232326] rounded-lg mx-auto mb-4"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Divider skeleton */}
          <motion.div 
            className="w-16 h-px bg-[#232326] mx-auto mb-6"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          
          {/* Subtitle skeleton */}
          <motion.div 
            className="w-96 h-6 bg-[#232326] rounded-lg mx-auto"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </motion.section>

      {/* Our Story Section Skeleton */}
      <motion.section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid items-center justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            {/* Text content skeleton */}
            <div className="flex flex-col items-center space-y-6 lg:items-start">
              {/* Section title */}
              <motion.div 
                className="w-48 h-10 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Divider */}
              <motion.div 
                className="w-16 h-px bg-[#232326]"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              
              {/* Paragraph lines */}
              {[...Array(4)].map((_, idx) => (
                <motion.div
                  key={idx}
                  className="w-full h-4 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 + idx * 0.1 }}
                />
              ))}
              
              {/* Button skeleton */}
              <motion.div 
                className="w-32 h-10 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            </div>
            
            {/* Image skeleton */}
            <motion.div 
              className="w-full h-96 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Our Values Section Skeleton */}
      <motion.section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          {/* Section header */}
          <div className="mb-16 text-center">
            <motion.div 
              className="w-64 h-10 bg-[#232326] rounded-lg mx-auto mb-4"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-16 h-px bg-[#232326] mx-auto mb-6"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div 
              className="w-80 h-6 bg-[#232326] rounded-lg mx-auto"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>
          
          {/* Values cards */}
          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="border-0 shadow-sm text-center bg-[#18181b] rounded-lg p-8">
                {/* Icon skeleton */}
                <motion.div 
                  className="w-12 h-12 bg-[#232326] rounded-lg mx-auto mb-4"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
                />
                
                {/* Title skeleton */}
                <motion.div 
                  className="w-24 h-6 bg-[#232326] rounded-lg mx-auto mb-4"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 + 0.1 }}
                />
                
                {/* Description lines */}
                {[...Array(3)].map((_, lineIdx) => (
                  <motion.div
                    key={lineIdx}
                    className="w-full h-4 bg-[#232326] rounded-lg mb-2"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 + 0.2 + lineIdx * 0.05 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Process Section Skeleton */}
      <motion.section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          {/* Section header */}
          <div className="mb-16 text-center">
            <motion.div 
              className="w-64 h-10 bg-[#232326] rounded-lg mx-auto mb-4"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-16 h-px bg-[#232326] mx-auto mb-6"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div 
              className="w-80 h-6 bg-[#232326] rounded-lg mx-auto"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>
          
          {/* Process steps */}
          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="space-y-4 text-center">
                {/* Step number */}
                <motion.div 
                  className="w-16 h-16 bg-[#232326] rounded-lg mx-auto"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
                />
                
                {/* Step title */}
                <motion.div 
                  className="w-32 h-6 bg-[#232326] rounded-lg mx-auto"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 + 0.1 }}
                />
                
                {/* Step description */}
                <motion.div 
                  className="w-full h-4 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 + 0.2 }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section Skeleton */}
      <motion.section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto text-center">
          {/* CTA title */}
          <motion.div 
            className="w-80 h-8 bg-[#232326] rounded-lg mx-auto mb-4"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* CTA description */}
          <motion.div 
            className="w-96 h-6 bg-[#232326] rounded-lg mx-auto mb-8"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          
          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div 
              className="w-32 h-10 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div 
              className="w-32 h-10 bg-[#232326] rounded-lg"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutSkeleton;
