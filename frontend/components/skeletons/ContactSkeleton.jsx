"use client";

import { motion } from "framer-motion";

export const ContactSkeleton = () => {
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

      {/* Contact Form & Info Section Skeleton */}
      <motion.section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            {/* Contact Form Skeleton */}
            <div className="space-y-8 flex flex-col items-center lg:items-start w-full lg:w-[520px] xl:w-[600px] mx-auto">
              {/* Form header */}
              <div>
                <motion.div 
                  className="w-48 h-8 bg-[#232326] rounded-lg mb-4"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-12 h-px bg-[#232326] mb-6"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                />
                <motion.div 
                  className="w-80 h-5 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
              </div>

              {/* Form fields */}
              <div className="w-full max-w-xl space-y-6">
                {/* Name fields row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <motion.div 
                      className="w-20 h-4 bg-[#232326] rounded mb-2"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-full h-12 bg-[#232326] rounded-lg"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </div>
                  <div>
                    <motion.div 
                      className="w-20 h-4 bg-[#232326] rounded mb-2"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                    />
                    <motion.div 
                      className="w-full h-12 bg-[#232326] rounded-lg"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <motion.div 
                    className="w-16 h-4 bg-[#232326] rounded mb-2"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                  <motion.div 
                    className="w-full h-12 bg-[#232326] rounded-lg"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
                  />
                </div>

                {/* Phone field */}
                <div>
                  <motion.div 
                    className="w-16 h-4 bg-[#232326] rounded mb-2"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />
                  <motion.div 
                    className="w-full h-12 bg-[#232326] rounded-lg"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.65 }}
                  />
                </div>

                {/* Subject field */}
                <div>
                  <motion.div 
                    className="w-16 h-4 bg-[#232326] rounded mb-2"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  />
                  <motion.div 
                    className="w-full h-12 bg-[#232326] rounded-lg"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                  />
                </div>

                {/* Message field */}
                <div>
                  <motion.div 
                    className="w-20 h-4 bg-[#232326] rounded mb-2"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  />
                  <motion.div 
                    className="w-full h-32 bg-[#232326] rounded-lg"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.85 }}
                  />
                </div>

                {/* Submit button */}
                <motion.div 
                  className="w-32 h-12 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                />
              </div>
            </div>

            {/* Contact Info Skeleton */}
            <div className="space-y-8 flex flex-col items-center lg:items-start">
              {/* Info header */}
              <div>
                <motion.div 
                  className="w-48 h-8 bg-[#232326] rounded-lg mb-4"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.div 
                  className="w-12 h-px bg-[#232326] mb-6"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.div 
                  className="w-64 h-5 bg-[#232326] rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </div>

              {/* Contact info cards */}
              <div className="space-y-6 w-full">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="border border-[#232326] rounded-lg p-6 bg-[#23232a]/60">
                    <div className="flex items-start space-x-4">
                      {/* Icon skeleton */}
                      <motion.div 
                        className="w-6 h-6 bg-[#232326] rounded"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 + idx * 0.1 }}
                      />
                      <div className="flex-1 space-y-2">
                        {/* Info title */}
                        <motion.div 
                          className="w-24 h-5 bg-[#232326] rounded"
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.65 + idx * 0.1 }}
                        />
                        {/* Info content */}
                        <motion.div 
                          className="w-40 h-4 bg-[#232326] rounded"
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 + idx * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Map Section Skeleton */}
      <motion.section className="py-16 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-8">
            <motion.div 
              className="w-40 h-8 bg-[#232326] rounded-lg mx-auto mb-4"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-64 h-5 bg-[#232326] rounded-lg mx-auto"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
          </div>
          
          {/* Map skeleton */}
          <motion.div 
            className="w-full h-96 bg-[#232326] rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
      </motion.section>
    </div>
  );
};

export default ContactSkeleton;
