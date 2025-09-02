import { motion } from "framer-motion";

export const HomePageSkeleton = () => {
  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        {/* Background with shimmer effect */}
        <div className="absolute inset-0 bg-[#232326]">
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={idx}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: idx * 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Enhanced shimmer effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="w-2/3 h-full bg-gradient-to-r from-transparent via-[#ffffff15] to-transparent transform -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: idx * 0.5
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Info Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-4xl">
            <motion.div 
              className="w-3/4 h-12 sm:h-14 md:h-16 lg:h-20 bg-[#232326]/80 backdrop-blur-sm rounded-lg mb-4"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffffff10] to-transparent skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
            <motion.div 
              className="w-1/2 h-6 bg-[#232326]/80 rounded-lg mb-8 overflow-hidden"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0.8 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffffff10] to-transparent skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.3
                }}
              />
            </motion.div>
            <motion.div 
              className="w-48 h-12 bg-[#232326]/80 rounded-lg overflow-hidden"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0.8 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffffff10] to-transparent skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.6
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Collections Skeleton */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <motion.div 
              className="w-64 h-8 bg-[#232326] rounded-lg mx-auto mb-4"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-16 h-px bg-[#232326] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col bg-[#232326] rounded-xl overflow-hidden"
                style={{ minHeight: 320 }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
              >
                <div className="w-full aspect-[4/3] bg-[#2a2a2e]" />
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                  <div className="w-24 h-4 bg-[#2a2a2e] rounded-lg" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="flex flex-col items-center space-y-6 lg:items-start">
              <motion.div 
                className="w-64 h-8 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="w-16 h-px bg-[#232326]"></div>
              <motion.div 
                className="w-full h-24 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div 
                className="w-full h-24 bg-[#232326] rounded-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
            <motion.div 
              className="relative w-full h-[420px] sm:h-[500px] md:h-[600px] lg:h-[650px] xl:h-[700px] bg-[#232326] rounded-xl"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#232326] rounded-xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-16 bg-[#23232a] border-t-2 border-[#232326]">
        <div className="container flex justify-center px-4 mx-auto">
          <div className="grid w-full max-w-xl grid-cols-1 gap-8 md:grid-cols-2">
            {[...Array(2)].map((_, idx) => (
              <motion.div 
                key={idx}
                className="space-y-4 text-center"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
              >
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-[#232326] rounded-full" />
                </div>
                <div className="w-32 h-4 bg-[#232326] rounded-lg mx-auto" />
                <div className="w-48 h-4 bg-[#232326] rounded-lg mx-auto" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
