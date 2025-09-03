"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/Hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { HomePageSkeleton } from "@/components/skeletons/HomePageSkeleton"

export default function HomePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // No need to simulate loading for static content
    setLoading(false);
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  
  if (loading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Hero Section */}
      <Hero />

  

      {/* Poetic Quote Section */}
      <section className="py-24 bg-[#18181b] relative overflow-hidden">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Decorative elements */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#bfc1c6]"></div>
              <div className="w-2 h-2 bg-[#bfc1c6] rounded-full"></div>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#bfc1c6]"></div>
            </div>

            {/* Main quote */}
            <blockquote className="space-y-4 text-center">
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#e5e7eb] leading-relaxed tracking-wide">
                {t('poetic_quote.line1')}
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#e5e7eb] leading-relaxed tracking-wide">
                {t('poetic_quote.line2')}
              </p>
              <footer className="text-lg md:text-xl font-light text-[#bfc1c6] tracking-widest mt-6">
                {t('poetic_quote.author')}
              </footer>
            </blockquote>

            {/* Subtle bottom decoration */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="w-2 h-2 bg-[#bfc1c6] rounded-full opacity-50"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#bfc1c6] to-transparent"></div>
              <div className="w-2 h-2 bg-[#bfc1c6] rounded-full opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#bfc1c6] rounded-full"></div>
        </div>
      </section>

      {/* Section Divider 2 */}
      <div className="relative py-8 bg-[#18181b]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#bfc1c6]/40 to-transparent"></div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 bg-[#18181b] relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-[#e5e7eb] mb-6">
                {t('jewelry_art_title')}
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#bfc1c6] to-transparent mx-auto"></div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-6 text-center lg:text-left">
                <p className="text-lg md:text-xl text-[#bfc1c6] leading-relaxed font-light">
                  {t('jewelry_art_desc1')}
                </p>
                <p className="text-lg md:text-xl text-[#bfc1c6] leading-relaxed font-light">
                  {t('jewelry_art_desc2')}
                </p>
              </div>

              <div className="relative">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50">
                    <Image
                      src="/images/texnh.jpeg"
                      alt="Jewelry crafting"
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                      priority
                    />
                  </div>
                  {/* Minimal accent */}
                  <div className="absolute -bottom-2 -right-2 w-full h-full border border-[#bfc1c6]/30 rounded-2xl -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle background element */}
        <div className="absolute top-1/4 right-0 w-64 h-64 opacity-[0.02] -z-10">
          <div className="w-full h-full border border-[#bfc1c6] rounded-full"></div>
        </div>
      </section>

      {/* Section Divider 3 */}
      <div className="relative py-8 bg-[#18181b]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#bfc1c6]/40 to-transparent"></div>
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-[#23232a]">
        <div className="container flex justify-center px-4 mx-auto">
          <div className="grid w-full max-w-xl grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { icon: Truck, title: t('free_shipping'), subtitle: t('free_shipping_desc') },
              { icon: RotateCcw, title: t('easy_returns'), subtitle: t('easy_returns_desc') },
            ].map((feature, index) => (
              <div key={index} className="space-y-4 text-center">
                <div className="flex justify-center">
                  <feature.icon className="w-8 h-8 text-[#bfc1c6]" />
                </div>
                <h3 className="text-lg font-light text-[#e5e7eb] tracking-wide">{feature.title}</h3>
                <p className="text-[#bfc1c6] text-sm font-light">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
