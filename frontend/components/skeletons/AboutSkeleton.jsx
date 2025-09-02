import React from "react";

export function AboutSkeleton() {
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section Skeleton */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <div className="w-3/4 h-12 mx-auto mb-4 bg-[#23232a] animate-pulse rounded"></div>
          <div className="w-16 h-px bg-[#23232a] mx-auto mb-6"></div>
          <div className="w-2/3 h-20 mx-auto bg-[#23232a] animate-pulse rounded"></div>
        </div>
      </section>

      {/* Our Story Skeleton */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid items-center justify-center grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="flex flex-col items-center space-y-6 lg:items-start">
              <div className="w-3/4 h-10 bg-[#23232a] animate-pulse rounded"></div>
              <div className="w-16 h-px bg-[#23232a]"></div>
              <div className="w-full h-32 bg-[#23232a] animate-pulse rounded"></div>
              <div className="w-32 h-10 bg-[#23232a] animate-pulse rounded"></div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="w-[400px] h-96 bg-[#23232a] animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Skeleton */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <div className="w-1/2 h-10 mx-auto mb-4 bg-[#18181b] animate-pulse rounded"></div>
            <div className="w-16 h-px bg-[#18181b] mx-auto mb-6"></div>
            <div className="w-2/3 h-16 mx-auto bg-[#18181b] animate-pulse rounded"></div>
          </div>
          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-8 bg-[#18181b] rounded-lg">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#23232a] animate-pulse rounded-full"></div>
                <div className="w-3/4 h-6 mx-auto mb-4 bg-[#23232a] animate-pulse rounded"></div>
                <div className="w-full h-20 mx-auto bg-[#23232a] animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Skeleton */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <div className="w-1/2 h-10 mx-auto mb-4 bg-[#18181b] animate-pulse rounded"></div>
            <div className="w-16 h-px bg-[#18181b] mx-auto mb-6"></div>
            <div className="w-2/3 h-16 mx-auto bg-[#18181b] animate-pulse rounded"></div>
          </div>
          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#18181b] animate-pulse rounded-full"></div>
                <div className="w-3/4 h-6 mx-auto bg-[#18181b] animate-pulse rounded"></div>
                <div className="w-full h-16 mx-auto bg-[#18181b] animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto text-center">
          <div className="w-1/2 h-8 mx-auto mb-4 bg-[#23232a] animate-pulse rounded"></div>
          <div className="w-2/3 h-16 mx-auto mb-8 bg-[#23232a] animate-pulse rounded"></div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="w-40 h-12 bg-[#23232a] animate-pulse rounded"></div>
            <div className="w-40 h-12 bg-[#23232a] animate-pulse rounded"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
