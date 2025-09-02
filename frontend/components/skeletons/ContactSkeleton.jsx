"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactSkeleton() {
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section Skeleton */}
      <section className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]">
        <div className="container px-4 mx-auto text-center">
          <Skeleton className="h-12 w-64 md:w-80 mx-auto mb-4 bg-[#23232a]" />
          <div className="w-16 h-px bg-[#23232a] mx-auto mb-6"></div>
          <Skeleton className="h-20 w-full max-w-2xl mx-auto bg-[#23232a]" />
        </div>
      </section>

      {/* Contact Form & Info Skeleton */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            {/* Contact Form Skeleton */}
            <div className="space-y-8 flex flex-col items-center lg:items-start w-full lg:w-[520px] xl:w-[600px] mx-auto">
              <div>
                <Skeleton className="h-8 w-48 mb-4 bg-[#23232a]" />
                <div className="w-12 h-px bg-[#23232a] mb-6"></div>
                <Skeleton className="h-16 w-full bg-[#23232a]" />
              </div>

              <div className="w-full max-w-xl space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Name Fields */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24 bg-[#23232a]" />
                    <Skeleton className="h-10 w-full bg-[#23232a]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24 bg-[#23232a]" />
                    <Skeleton className="h-10 w-full bg-[#23232a]" />
                  </div>
                </div>

                {/* Email and Subject Fields */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 bg-[#23232a]" />
                  <Skeleton className="h-10 w-full bg-[#23232a]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 bg-[#23232a]" />
                  <Skeleton className="h-10 w-full bg-[#23232a]" />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 bg-[#23232a]" />
                  <Skeleton className="h-32 w-full bg-[#23232a]" />
                </div>

                {/* Submit Button */}
                <Skeleton className="h-10 w-full md:w-32 bg-[#23232a]" />
              </div>
            </div>

            {/* Contact Info Skeleton */}
            <div className="space-y-8">
              <div>
                <Skeleton className="h-8 w-48 mb-4 bg-[#23232a]" />
                <div className="w-12 h-px bg-[#23232a] mb-6"></div>
                <Skeleton className="h-16 w-full bg-[#23232a]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#23232a] mx-auto lg:mx-0" />
                    <Skeleton className="h-6 w-32 bg-[#23232a] mx-auto lg:mx-0" />
                    <Skeleton className="h-12 w-full bg-[#23232a]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
